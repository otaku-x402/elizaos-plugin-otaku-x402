/**
 * ANALYZE_TOKEN Action
 * AI-powered token analysis using KOL market data
 */

import { Action, IAgentRuntime, Memory, State, HandlerCallback } from '@ai16z/eliza';
import axios from 'axios';
import { TradingSignal, HotToken, LeaderboardTrader } from '../types';

export const analyzeTokenAction: Action = {
    name: 'ANALYZE_TOKEN',
    similes: [
        'ANALYZE_CRYPTO',
        'CHECK_TOKEN',
        'EVALUATE_TOKEN',
        'TOKEN_ANALYSIS',
        'SHOULD_I_BUY',
        'TOKEN_RECOMMENDATION'
    ],
    description: 'Analyzes a Solana token using real-time KOL trading data and provides buy/sell/hold recommendations',

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const apiUrl = runtime.getSetting('KOL_API_URL');
        if (!apiUrl) {
            console.warn('KOL_API_URL not configured, using default');
        }
        return true;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        options: any,
        callback: HandlerCallback | undefined
    ): Promise<boolean> => {
        try {
            const apiBaseUrl = runtime.getSetting('KOL_API_URL') || 'https://api.otakux402.so';

            // Extract token symbol or address from message
            const text = message.content.text.toUpperCase();
            const tokenMatch = text.match(/\$([A-Z0-9]+)|([1-9A-HJ-NP-Za-km-z]{32,44})/);

            if (!tokenMatch) {
                if (callback) {
                    callback({
                        text: "I need a token symbol (e.g., $BONK) or Solana address to analyze. Please provide one.",
                        action: 'ANALYZE_TOKEN'
                    });
                }
                return false;
            }

            const tokenIdentifier = tokenMatch[1] || tokenMatch[2];

            // Fetch market data
            const [hotTokensRes, leaderboardRes, tradesRes] = await Promise.all([
                axios.get(`${apiBaseUrl}/hot-tokens?timeframe=1h&limit=50`),
                axios.get(`${apiBaseUrl}/leaderboard?timeframe=daily&limit=20`),
                axios.get(`${apiBaseUrl}/trades?limit=100`)
            ]);

            const hotTokens: HotToken[] = hotTokensRes.data || [];
            const leaderboard: LeaderboardTrader[] = leaderboardRes.data || [];
            const recentTrades = tradesRes.data || [];

            // Find the token in hot tokens
            const token = hotTokens.find(t =>
                t.symbol.toUpperCase() === tokenIdentifier ||
                t.token_address === tokenIdentifier
            );

            if (!token) {
                if (callback) {
                    callback({
                        text: `I couldn't find token ${tokenIdentifier} in the current hot tokens list. It might not have enough trading activity yet, or the symbol might be incorrect.`,
                        action: 'ANALYZE_TOKEN'
                    });
                }
                return false;
            }

            // Generate trading signal
            const signal = generateTradingSignal(token, hotTokens, leaderboard, recentTrades);

            // Format response
            const response = formatAnalysisResponse(token, signal);

            if (callback) {
                callback({
                    text: response,
                    action: 'ANALYZE_TOKEN',
                    metadata: {
                        token: token.symbol,
                        token_address: token.token_address,
                        signal: signal.action,
                        confidence: signal.confidence
                    }
                });
            }

            return true;

        } catch (error) {
            console.error('Error in analyzeToken action:', error);
            if (callback) {
                callback({
                    text: "Sorry, I encountered an error analyzing the token. Please try again later.",
                    action: 'ANALYZE_TOKEN'
                });
            }
            return false;
        }
    },

    examples: [
        [
            {
                user: '{{user1}}',
                content: { text: 'Should I buy $BONK?' }
            },
            {
                user: '{{agent}}',
                content: {
                    text: 'Let me analyze $BONK for you...',
                    action: 'ANALYZE_TOKEN'
                }
            }
        ],
        [
            {
                user: '{{user1}}',
                content: { text: 'Analyze token pump123abc...' }
            },
            {
                user: '{{agent}}',
                content: {
                    text: 'Analyzing token address...',
                    action: 'ANALYZE_TOKEN'
                }
            }
        ]
    ]
};

function generateTradingSignal(
    token: HotToken,
    allTokens: HotToken[],
    topTraders: LeaderboardTrader[],
    recentTrades: any[]
): TradingSignal {
    // Calculate scores
    const volumeScore = calculateVolumeScore(token, allTokens);
    const traderScore = calculateTraderScore(token, topTraders);
    const momentumScore = calculateMomentumScore(token, recentTrades);

    const overallScore = (volumeScore + traderScore + momentumScore) / 3;

    // Determine action
    let action: 'BUY' | 'HOLD' | 'SELL';
    let confidence: number;
    let reasoning: string;

    if (overallScore >= 70) {
        action = 'BUY';
        confidence = overallScore;
        reasoning = `Strong buy signal. High volume (${token.trade_count} trades), strong trader interest, and positive momentum.`;
    } else if (overallScore >= 40) {
        action = 'HOLD';
        confidence = overallScore;
        reasoning = `Neutral signal. Moderate activity but not enough conviction for entry.`;
    } else {
        action = 'SELL';
        confidence = 100 - overallScore;
        reasoning = `Weak signal. Low volume or declining interest from top traders.`;
    }

    // Risk assessment
    let risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    if (token.trade_count < 10) risk_level = 'HIGH';
    else if (token.trade_count < 50) risk_level = 'MEDIUM';
    else risk_level = 'LOW';

    return {
        action,
        confidence: Math.round(confidence),
        token: token.symbol,
        token_address: token.token_address,
        reasoning,
        metrics: {
            volume_score: Math.round(volumeScore),
            trader_score: Math.round(traderScore),
            momentum_score: Math.round(momentumScore),
            risk_level
        }
    };
}

function calculateVolumeScore(token: HotToken, allTokens: HotToken[]): number {
    const maxVolume = Math.max(...allTokens.map(t => t.total_volume_sol));
    return (token.total_volume_sol / maxVolume) * 100;
}

function calculateTraderScore(token: HotToken, topTraders: LeaderboardTrader[]): number {
    // Higher score if token has many trades (suggests trader interest)
    const maxTrades = Math.max(...[token.trade_count, 100]);
    return Math.min((token.trade_count / maxTrades) * 100, 100);
}

function calculateMomentumScore(token: HotToken, recentTrades: any[]): number {
    // Simple momentum: more recent trades = higher score
    const tokenTrades = recentTrades.filter(t =>
        t.token_address === token.token_address
    );
    return Math.min((tokenTrades.length / 20) * 100, 100);
}

function formatAnalysisResponse(token: HotToken, signal: TradingSignal): string {
    const actionEmoji = {
        'BUY': '🟢',
        'HOLD': '🟡',
        'SELL': '🔴'
    };

    return `
📊 **Token Analysis: $${token.symbol}**

${actionEmoji[signal.action]} **Recommendation: ${signal.action}**
Confidence: ${signal.confidence}%

**Metrics:**
• Volume Score: ${signal.metrics.volume_score}/100
• Trader Interest: ${signal.metrics.trader_score}/100
• Momentum: ${signal.metrics.momentum_score}/100
• Risk Level: ${signal.metrics.risk_level}

**Market Data:**
• Total Trades: ${token.trade_count}
• Volume: ${token.total_volume_sol.toFixed(2)} SOL ($${token.total_volume_usd.toFixed(2)})
• Timeframe: ${token.timeframe}

**Reasoning:**
${signal.reasoning}

**Contract:** \`${token.token_address}\`

*Note: This is AI-generated analysis based on real-time KOL trading data. Always DYOR (Do Your Own Research) before investing.*
`.trim();
}
