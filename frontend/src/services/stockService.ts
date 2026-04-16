const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_KEY ?? '';
const FINNHUB_API_URL = 'https://finnhub.io/api/v1';

export interface Stock {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    logo?: string;
    name?: string;
}

export const getStockQuote = async (symbol: string): Promise<Stock> => {
    try {
        const url = `${FINNHUB_API_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.c || data.c === null || isNaN(data.c) || !data.pc || data.pc === null) {
            throw new Error(`No data available for ${symbol}. This stock may not be available on the free plan.`);
        }
        
        return {
            symbol: symbol,
            price: data.c,
            change: data.c - data.pc,
            changePercent: ((data.c - data.pc) / data.pc) * 100
        };
    } catch (error) {
        console.error('Error fetching stock:', error);
        throw error;
    }
};

export const getCompanyProfile = async (symbol: string) => {
    try {
        const url = `${FINNHUB_API_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

export const searchStock = async (query: string) => {
    try {
        const url = `${FINNHUB_API_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.result || [];
    } catch (error) {
        console.error('Error searching:', error);
        return [];
    }
};