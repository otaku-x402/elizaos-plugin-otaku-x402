/**
 * Quick Test Script for KOL Plugin
 * Tests the plugin actions without running full ElizaOS
 */

const axios = require('axios');

const API_BASE_URL = 'https://api.otaku-x402.com/api';

async function testHotTokensEndpoint() {
    console.log('\n🔥 Testing Hot Tokens Endpoint...\n');
    try {
        const response = await axios.get(`${API_BASE_URL}/hot-tokens?timeframe=1h&limit=10`);
        console.log('✅ Status:', response.status);
        console.log('📊 Data count:', response.data?.length || response.data?.data?.length || 0);

        if (response.data?.data) {
            const tokens = response.data.data.slice(0, 3);
            console.log('\nTop 3 Hot Tokens:');
            tokens.forEach((token, idx) => {
                console.log(`${idx + 1}. $${token.symbol} - ${token.trade_count} trades, ${token.total_volume_sol?.toFixed(2)} SOL`);
            });
        } else if (Array.isArray(response.data)) {
            const tokens = response.data.slice(0, 3);
            console.log('\nTop 3 Hot Tokens:');
            tokens.forEach((token, idx) => {
                console.log(`${idx + 1}. $${token.symbol} - ${token.trade_count} trades, ${token.total_volume_sol?.toFixed(2)} SOL`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

async function testLeaderboardEndpoint() {
    console.log('\n🏆 Testing Leaderboard Endpoint...\n');
    try {
        const response = await axios.get(`${API_BASE_URL}/leaderboard?timeframe=daily&limit=10`);
        console.log('✅ Status:', response.status);
        console.log('👥 Data count:', response.data?.length || response.data?.data?.length || 0);

        const traders = response.data?.data || response.data;
        if (traders && traders.length > 0) {
            console.log('\nTop 3 Traders:');
            traders.slice(0, 3).forEach((trader, idx) => {
                console.log(`${idx + 1}. ${trader.trader_name} - PnL: ${trader.pnl_sol?.toFixed(2)} SOL`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
        }
    }
}

async function testTradersEndpoint() {
    console.log('\n👥 Testing Traders Endpoint...\n');
    try {
        const response = await axios.get(`${API_BASE_URL}/traders?limit=10`);
        console.log('✅ Status:', response.status);
        console.log('📊 Data count:', response.data?.length || response.data?.data?.length || 0);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testTradesEndpoint() {
    console.log('\n📊 Testing Trades Endpoint...\n');
    try {
        const response = await axios.get(`${API_BASE_URL}/trades?limit=20`);
        console.log('✅ Status:', response.status);
        console.log('💼 Data count:', response.data?.length || response.data?.data?.length || 0);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testHealthEndpoint() {
    console.log('\n❤️  Testing Health Endpoint...\n');
    try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Status:', response.status);
        console.log('📋 Health:', response.data);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function runAllTests() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  KOL Plugin - API Endpoint Tests      ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n🌐 API Base URL: ${API_BASE_URL}\n`);

    await testHealthEndpoint();
    await testHotTokensEndpoint();
    await testLeaderboardEndpoint();
    await testTradersEndpoint();
    await testTradesEndpoint();

    console.log('\n✨ All tests completed!\n');
}

// Run tests
runAllTests().catch(console.error);
