/** Auth-funktiot */
/** eli sisältää register() <- POST /api/users/register */
/** login() <- POST /api/auth/login (tulevaisuudessa) */
/** logout() */

import type { Customer } from '../types/api.types'

const API_URL = 'https://stockfolio-postgres-stockfolio-postgres.2.rahtiapp.fi/api'

export const addCustomer = async (customer: Omit<Customer, '_links'>): Promise<Customer> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    });
    return response.json();
}