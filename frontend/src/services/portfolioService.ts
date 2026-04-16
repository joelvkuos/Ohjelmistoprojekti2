/** Portfolio API service */

import { fetchAPI } from './apiClient';
import type { Portfolio, Holdings } from '../types/api.types';

export type { Portfolio, Holdings };

export const getMyPortfolios = async (accessToken: string): Promise<Portfolio[]> => {
    try {
        return await fetchAPI('/portfolio/my', { requiresAuth: true }, accessToken);
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        throw error;
    }
};

export const getAllPortfolios = async (accessToken: string): Promise<Portfolio[]> => {
    try {
        return await fetchAPI('/portfolio', { requiresAuth: true }, accessToken);
    } catch (error) {
        console.error('Error fetching all portfolios:', error);
        throw error;
    }
};

export const getPortfolio = async (id: number, accessToken: string): Promise<Portfolio> => {
    try {
        return await fetchAPI(`/portfolio/${id}`, { requiresAuth: true }, accessToken);
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        throw error;
    }
};

export const createPortfolio = async (portfolio: { portfolioName: string }, accessToken: string): Promise<Portfolio> => {
    try {
        return await fetchAPI('/portfolio', {
            method: 'POST',
            body: JSON.stringify(portfolio),
            requiresAuth: true
        }, accessToken);
    } catch (error) {
        console.error('Error creating portfolio:', error);
        throw error;
    }
};

export const updatePortfolio = async (id: number, portfolio: Partial<Portfolio>, accessToken: string): Promise<Portfolio> => {
    try {
        return await fetchAPI(`/portfolio/${id}`, {
            method: 'PUT',
            body: JSON.stringify(portfolio),
            requiresAuth: true
        }, accessToken);
    } catch (error) {
        console.error('Error updating portfolio:', error);
        throw error;
    }
};

export const deletePortfolio = async (id: number, accessToken: string): Promise<void> => {
    try {
        await fetchAPI(`/portfolio/${id}`, {
            method: 'DELETE',
            requiresAuth: true
        }, accessToken);
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        throw error;
    }
};