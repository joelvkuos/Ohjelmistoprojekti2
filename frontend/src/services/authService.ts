/** Auth-funktiot */
/** eli sisältää register() <- POST /api/users/register */
/** login() <- POST /api/auth/login (tulevaisuudessa) */
/** logout() */

import type { Customer } from '../types/api.types'

const API_URL = 'https://stockfolio-postgres-stockfolio-postgres.2.rahtiapp.fi/api'

export const addCustomer = async (customer: Customer): Promise<Customer> => {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: customer.username,
            password: customer.password,
            email: customer.email,
            phone: customer.phone
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
    }

    return response.json();
}