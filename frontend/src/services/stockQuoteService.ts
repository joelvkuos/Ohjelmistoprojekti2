/** Finnhub Stock Quote API */

import type { StockQuote } from '../types/api.types';

export type { StockQuote };

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_KEY ?? '';
const FINNHUB_QUOTE_URL = 'https://finnhub.io/api/v1/quote';

export const getStockQuote = async (ticker: string): Promise<StockQuote> => {
    try {
        if (!FINNHUB_API_KEY) {
            throw new Error('Finnhub API key not found. Check your .env file.');
        }

        const url = `${FINNHUB_QUOTE_URL}?symbol=${ticker.toUpperCase()}&token=${FINNHUB_API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error(`Failed to fetch quote for ${ticker}: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            ticker: ticker.toUpperCase(),
            currentPrice: data.c ?? 0,
            change: data.d ?? 0,
            changePercent: data.dp ?? 0,
            timestamp: data.t ?? Date.now() / 1000
        };
    } catch (error) {
        console.error(`Error fetching quote for ${ticker}:`, error);
        throw error;
    }
};

export const getMultipleStockQuotes = async (tickers: string[]): Promise<StockQuote[]> => {
    try {
        const quotes = await Promise.all(
            tickers.map(ticker => getStockQuote(ticker))
        );
        return quotes;
    } catch (error) {
        console.error('Error fetching multiple quotes:', error);
        throw error;
    }
};