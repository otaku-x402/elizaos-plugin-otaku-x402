/**
 * KOL API Data Types
 */

export interface HotToken {
    symbol: string;
    token_address: string;
    trade_count: number;
    total_volume_sol: number;
    total_volume_usd: number;
    timeframe: string;
}

export interface LeaderboardTrader {
    id: number;
    trader_name: string;
    wallet_address: string;
    ranking_position: number;
    pnl_sol: number;
    pnl_usd: number;
    wins: number;
    losses: number;
    timeframe: string;
}

export interface Trader {
    id: number;
    trader_name: string;
    wallet_address: string;
    total_trades: number;
    total_volume_sol: number;
    total_volume_usd: number;
}

export interface TokenActivity {
    symbol: string;
    token_address: string;
    trade_count: number;
    buy_count: number;
    sell_count: number;
    total_volume_sol: number;
    total_volume_usd: number;
    unique_traders: number;
}

export interface TradingSignal {
    action: 'BUY' | 'HOLD' | 'SELL';
    confidence: number; // 0-100
    token: string;
    token_address: string;
    reasoning: string;
    metrics: {
        volume_score: number;
        trader_score: number;
        momentum_score: number;
        risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    };
}

export interface X402PaymentConfig {
    enabled: boolean;
    price_per_request_usdc: number;
    payment_address: string;
    accepted_tokens: string[];
}

export interface KOLAPIConfig {
    base_url: string;
    x402_config?: X402PaymentConfig;
}
