/** User CRUD */

import { fetchAPI } from './apiClient';

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    phone: string;
}

// Hakee nykyisen käyttäjän tiedot
export const getCurrentUser = async (accessToken: string): Promise<UserProfile> => {
    try {
        return await fetchAPI('/users/current', { requiresAuth: true }, accessToken);
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

// Päivitää käyttäjän tiedot
export const updateUserProfile = async (
    userData: Partial<UserProfile>,
    accessToken: string
): Promise<UserProfile> => {
    try {
        return await fetchAPI('/users/update', {
            method: 'PUT',
            body: JSON.stringify(userData),
            requiresAuth: true
        }, accessToken);
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};