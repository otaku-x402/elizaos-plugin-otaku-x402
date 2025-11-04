/**
 * GET_KOL_DATA Action
 * Retrieves KOL market data (supports X402 micropayments)
 */

import { Action, IAgentRuntime, Memory, State, HandlerCallback } from '@ai16z/eliza';
import axios from 'axios';

export const getKOLDataAction: Action = {
    name: 'GET_KOL_DATA',
    similes: [
        'FETCH_KOL_DATA',
        'GET_MARKET_DATA',
        'RETRIEVE_TRADING_DATA',
        'KOL_MARKET_INFO'
    ],
    description: 'Retrieves real-time KOL trading data including hot tokens, leaderboard, and trader activity. Supports X402 micropayments for AI agents.',

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
            const apiBaseUrl = runtime.getSetting('KOL_API_URL') || 'https://api.otaku-x402.com/api';

            // Parse request type from message
            const text = message.content.text.toLowerCase();
            let endpoint = '/hot-tokens?timeframe=1h&limit=10';
            let dataType = 'hot tokens';

            if (text.includes('leaderboard') || text.includes('top trader')) {
                endpoint = '/leaderboard?timeframe=daily&limit=10';
                dataType = 'leaderboard';
            } else if (text.includes('trader')) {
                endpoint = '/traders?limit=10';
                dataType = 'traders';
            } else if (text.includes('trade') || text.includes('activity')) {
                endpoint = '/trades?limit=20';
                dataType = 'recent trades';
            }

            // Fetch data
            const response = await axios.get(`${apiBaseUrl}${endpoint}`);
            let data = response.data;

            // Normalize data structure - handle various API response formats
            if (data && typeof data === 'object') {
                // If data has a 'data' property with an array, use that
                if (data.data && Array.isArray(data.data)) {
                    data = data.data;
                }
                // If data has a 'tokens' property with an array, use that
                else if (data.tokens && Array.isArray(data.tokens)) {
                    data = data.tokens;
                }
                // If data has a 'results' property with an array, use that
                else if (data.results && Array.isArray(data.results)) {
                    data = data.results;
                }
                // If data is not an array at this point, try to convert or default to empty array
                else if (!Array.isArray(data)) {
                    console.warn(`API returned non-array data for ${dataType}:`, typeof data);
                    data = [];
                }
            } else {
                console.warn(`API returned invalid data for ${dataType}:`, data);
                data = [];
            }

            // Format response based on data type
            let formattedResponse: string;

            if (dataType === 'hot tokens') {
                formattedResponse = formatHotTokens(data);
            } else if (dataType === 'leaderboard') {
                formattedResponse = formatLeaderboard(data);
            } else if (dataType === 'traders') {
                formattedResponse = formatTraders(data);
            } else {
                formattedResponse = formatTrades(data);
            }

            if (callback) {
                callback({
                    text: formattedResponse,
                    action: 'GET_KOL_DATA',
                    metadata: {
                        data_type: dataType,
                        count: data.length,
                        timestamp: new Date().toISOString()
                    }
                });
            }

            return true;

        } catch (error) {
            console.error('Error in getKOLData action:', error);
            if (callback) {
                callback({
                    text: "Sorry, I couldn't fetch the KOL data right now. Please try again later.",
                    action: 'GET_KOL_DATA'
                });
            }
            return false;
        }
    },

    examples: [
        [
            {
                user: '{{user1}}',
                content: { text: 'Show me the hot tokens' }
            },
            {
                user: '{{agent}}',
                content: {
                    text: 'Fetching hot tokens data...',
                    action: 'GET_KOL_DATA'
                }
            }
        ],
        [
            {
                user: '{{user1}}',
                content: { text: 'Who are the top traders today?' }
            },
            {
                user: '{{agent}}',
                content: {
                    text: 'Retrieving leaderboard...',
                    action: 'GET_KOL_DATA'
                }
            }
        ]
    ]
};

function formatHotTokens(tokens: any): string {
    // Defensive validation: ensure tokens is an array
    if (!tokens || !Array.isArray(tokens)) {
        console.error('formatHotTokens received non-array data:', typeof tokens);
        return 'No hot tokens data available at the moment. (Invalid data format)';
    }

    if (tokens.length === 0) {
        return 'No hot tokens data available at the moment.';
    }

    let response = '🔥 **Hot Tokens (Last Hour)**\n\n';

    tokens.slice(0, 10).forEach((token, idx) => {
        // Validate each token object has required properties
        if (!token || typeof token !== 'object') {
            console.warn('Invalid token entry at index', idx);
            return;
        }

        const symbol = token.symbol || 'UNKNOWN';
        const tradeCount = token.trade_count || 0;
        const volumeSol = typeof token.total_volume_sol === 'number' ? token.total_volume_sol : 0;
        const address = token.token_address || 'N/A';

        response += `${idx + 1}. **$${symbol}**\n`;
        response += `   • Trades: ${tradeCount}\n`;
        response += `   • Volume: ${volumeSol.toFixed(2)} SOL\n`;
        response += `   • Address: \`${address}\`\n\n`;
    });

    return response.trim();
}

function formatLeaderboard(traders: any): string {
    // Defensive validation: ensure traders is an array
    if (!traders || !Array.isArray(traders)) {
        console.error('formatLeaderboard received non-array data:', typeof traders);
        return 'No leaderboard data available at the moment. (Invalid data format)';
    }

    if (traders.length === 0) {
        return 'No leaderboard data available at the moment.';
    }

    let response = '🏆 **Top Traders (Daily)**\n\n';

    traders.slice(0, 10).forEach((trader, idx) => {
        // Validate each trader object
        if (!trader || typeof trader !== 'object') {
            console.warn('Invalid trader entry at index', idx);
            return;
        }

        const wins = trader.wins || 0;
        const losses = trader.losses || 0;
        const winRate = wins + losses > 0
            ? ((wins / (wins + losses)) * 100).toFixed(1)
            : (trader.win_rate || 0);

        const traderName = trader.trader_name || 'Unknown';
        const pnlSol = typeof trader.pnl_sol === 'number' ? trader.pnl_sol : 0;
        const rank = trader.rank || trader.ranking_position || (idx + 1);

        response += `${idx + 1}. **${traderName}**\n`;
        response += `   • PnL: ${pnlSol >= 0 ? '+' : ''}${pnlSol.toFixed(2)} SOL\n`;
        response += `   • Win Rate: ${winRate}% (${wins}W/${losses}L)\n`;
        response += `   • Rank: #${rank}\n\n`;
    });

    return response.trim();
}

function formatTraders(traders: any): string {
    // Defensive validation: ensure traders is an array
    if (!traders || !Array.isArray(traders)) {
        console.error('formatTraders received non-array data:', typeof traders);
        return 'No trader data available at the moment. (Invalid data format)';
    }

    if (traders.length === 0) {
        return 'No trader data available at the moment.';
    }

    let response = '👥 **Active Traders**\n\n';

    traders.slice(0, 10).forEach((trader, idx) => {
        // Validate each trader object
        if (!trader || typeof trader !== 'object') {
            console.warn('Invalid trader entry at index', idx);
            return;
        }

        const traderName = trader.trader_name || 'Unknown';
        const totalTrades = trader.total_trades || 0;
        const volumeSol = typeof trader.total_volume_sol === 'number' ? trader.total_volume_sol : 0;

        response += `${idx + 1}. **${traderName}**\n`;
        response += `   • Total Trades: ${totalTrades}\n`;
        response += `   • Volume: ${volumeSol.toFixed(2)} SOL\n\n`;
    });

    return response.trim();
}

function formatTrades(trades: any): string {
    // Defensive validation: ensure trades is an array
    if (!trades || !Array.isArray(trades)) {
        console.error('formatTrades received non-array data:', typeof trades);
        return 'No recent trades available. (Invalid data format)';
    }

    if (trades.length === 0) {
        return 'No recent trades available.';
    }

    let response = '📊 **Recent Trading Activity**\n\n';

    trades.slice(0, 10).forEach((trade, idx) => {
        // Validate each trade object
        if (!trade || typeof trade !== 'object') {
            console.warn('Invalid trade entry at index', idx);
            return;
        }

        const tradeType = trade.trade_type || 'TRADE';
        const emoji = tradeType === 'BUY' ? '🟢' : '🔴';
        const symbol = trade.symbol || 'Unknown';
        const amountSol = typeof trade.amount_sol === 'number' ? trade.amount_sol : 0;
        const traderName = trade.trader_name || 'Unknown';

        response += `${idx + 1}. ${emoji} **${tradeType}** $${symbol}\n`;
        response += `   • Amount: ${amountSol.toFixed(2)} SOL\n`;
        response += `   • Trader: ${traderName}\n\n`;
    });

    return response.trim();
}
