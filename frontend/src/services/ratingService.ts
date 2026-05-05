/** Rating API service */

import { fetchAPI } from './apiClient';
import type { Rating, AverageRatingResponse } from '../types/api.types';

export const addOrUpdateRating = async (portfolioId: number, ratingValue: number, accessToken: string): Promise<Rating> => {
    try {
        return await fetchAPI(`/rating/${portfolioId}`, {
            method: 'POST',
            body: JSON.stringify({ ratingValue }),
            requiresAuth: true
        }, accessToken);
    } catch (error) {
        console.error('Error adding/updating rating:', error);
        throw error;
    }
};

export const getAverageRating = async (portfolioId: number, accessToken: string): Promise<AverageRatingResponse> => {
    try {
        return await fetchAPI(`/rating/${portfolioId}/average`, { requiresAuth: true }, accessToken);
    } catch (error) {
        console.error('Error fetching average rating:', error);
        throw error;
    }
};

export const getUserRating = async (portfolioId: number, accessToken: string): Promise<Rating | null> => {
    try {
        const response = await fetchAPI(`/rating/${portfolioId}/my-rating`, { requiresAuth: true }, accessToken);
        return response as Rating;
    } catch (error) {
        
        return null;
    }
};

export const deleteRating = async (portfolioId: number, accessToken: string): Promise<void> => {
    try {
        await fetchAPI(`/rating/${portfolioId}`, {
            method: 'DELETE',
            requiresAuth: true
        }, accessToken);
    } catch (error) {
        console.error('Error deleting rating:', error);
        throw error;
    }
};
