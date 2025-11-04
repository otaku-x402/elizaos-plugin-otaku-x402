/**
 * KOL ElizaOS Plugin
 * AI-powered Solana token trading insights with X402 micropayment support
 */

import { Plugin } from '@ai16z/eliza';
import { analyzeTokenAction } from './actions/analyzeToken';
import { getKOLDataAction } from './actions/getKOLData';
import { kolProvider } from './providers/kolProvider';

export const kolPlugin: Plugin = {
    name: 'kol',
    description: 'KOL trading data plugin for ElizaOS - provides AI-powered Solana token analysis and market insights',

    actions: [
        analyzeTokenAction,
        getKOLDataAction
    ],

    providers: [
        kolProvider
    ],

    evaluators: [],

    services: []
};

export default kolPlugin;

// Export types for external use
export * from './types';
export { analyzeTokenAction, getKOLDataAction, kolProvider };
