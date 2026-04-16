/** Finnhub News API */

import type { NewsArticle } from '../types/api.types';

export type { NewsArticle };

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_KEY ?? '';
const FINNHUB_API_URL = 'https://finnhub.io/api/v1/news';

export const getMarketNews = async (category: string = 'general', limit: number = 20, offset: number = 0): Promise<NewsArticle[]> => {
    try {
        if (!FINNHUB_API_KEY) {
            throw new Error('Finnhub API key not found. Check your .env file.');
        }

        const url = `${FINNHUB_API_URL}?category=${category}&token=${FINNHUB_API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error(`Failed to fetch news: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.slice(offset, offset + limit);
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};
