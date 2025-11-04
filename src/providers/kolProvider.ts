/**
 * KOL Data Provider
 * Fetches real-time trading data from KOL API
 */

import { Provider, IAgentRuntime, Memory, State } from '@ai16z/eliza';
import axios from 'axios';
import { HotToken, LeaderboardTrader, Trader, TokenActivity } from '../types';

export const kolProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const apiBaseUrl = runtime.getSetting('KOL_API_URL') || 'https://api.otakux402.so';

        try {
            // Fetch all relevant data in parallel
            const [hotTokensRes, leaderboardRes, tradersRes] = await Promise.all([
                axios.get(`${apiBaseUrl}/hot-tokens?timeframe=1h&limit=10`),
                axios.get(`${apiBaseUrl}/leaderboard?timeframe=daily&limit=10`),
                axios.get(`${apiBaseUrl}/traders?limit=10`)
            ]);

            // Normalize and validate data structures
            let hotTokensData = hotTokensRes.data;
            if (hotTokensData && typeof hotTokensData === 'object' && !Array.isArray(hotTokensData)) {
                if (hotTokensData.data && Array.isArray(hotTokensData.data)) {
                    hotTokensData = hotTokensData.data;
                } else if (hotTokensData.tokens && Array.isArray(hotTokensData.tokens)) {
                    hotTokensData = hotTokensData.tokens;
                }
            }
            const hotTokens: HotToken[] = Array.isArray(hotTokensData) ? hotTokensData : [];

            let leaderboardData = leaderboardRes.data;
            if (leaderboardData && typeof leaderboardData === 'object' && !Array.isArray(leaderboardData)) {
                if (leaderboardData.data && Array.isArray(leaderboardData.data)) {
                    leaderboardData = leaderboardData.data;
                } else if (leaderboardData.leaderboard && Array.isArray(leaderboardData.leaderboard)) {
                    leaderboardData = leaderboardData.leaderboard;
                }
            }
            const leaderboard: LeaderboardTrader[] = Array.isArray(leaderboardData) ? leaderboardData : [];

            let tradersData = tradersRes.data;
            if (tradersData && typeof tradersData === 'object' && !Array.isArray(tradersData)) {
                if (tradersData.data && Array.isArray(tradersData.data)) {
                    tradersData = tradersData.data;
                } else if (tradersData.traders && Array.isArray(tradersData.traders)) {
                    tradersData = tradersData.traders;
                }
            }
            const topTraders: Trader[] = Array.isArray(tradersData) ? tradersData : [];

            // Build context for AI
            const context = {
                hot_tokens: hotTokens,
                top_traders_by_pnl: leaderboard,
                active_traders: topTraders,
                summary: generateSummary(hotTokens, leaderboard, topTraders),
                timestamp: new Date().toISOString()
            };

            return context;
        } catch (error) {
            console.error('Error fetching KOL data:', error);
            return {
                error: 'Failed to fetch KOL data',
                hot_tokens: [],
                top_traders_by_pnl: [],
                active_traders: [],
                summary: 'Data unavailable',
                timestamp: new Date().toISOString()
            };
        }
    }
};

function generateSummary(
    hotTokens: HotToken[],
    leaderboard: LeaderboardTrader[],
    traders: Trader[]
): string {
    const topToken = hotTokens[0];
    const topTrader = leaderboard[0];

    let summary = '📊 KOL Market Overview:\n\n';

    if (topToken) {
        summary += `🔥 Hottest Token (1h): $${topToken.symbol}\n`;
        summary += `   • ${topToken.trade_count} trades, ${topToken.total_volume_sol.toFixed(2)} SOL volume\n`;
        summary += `   • Address: ${topToken.token_address}\n\n`;
    }

    if (topTrader) {
        summary += `🏆 Top Trader (Daily): ${topTrader.trader_name}\n`;
        summary += `   • PnL: ${topTrader.pnl_sol >= 0 ? '+' : ''}${topTrader.pnl_sol.toFixed(2)} SOL\n`;
        summary += `   • Win Rate: ${topTrader.wins}W / ${topTrader.losses}L\n`;
        summary += `   • Rank: #${topTrader.ranking_position}\n\n`;
    }

    summary += `📈 Total Active Traders: ${traders.length}\n`;
    summary += `🎯 Hot Tokens Tracked: ${hotTokens.length}\n`;

    return summary;
}
