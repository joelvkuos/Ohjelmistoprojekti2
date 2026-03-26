/** Auth-funktiot */

import type { Customer, AuthResponse } from '../types/api.types'

const API_URL = 'https://stockfolio-postgres-stockfolio-postgres.2.rahtiapp.fi/api'
const USERNAME = import.meta.env.VITE_API_USERNAME ?? ''
const PASSWORD = import.meta.env.VITE_API_PASSWORD ?? ''

const credentials = btoa(`${USERNAME}:${PASSWORD}`)

export const addCustomer = async (customer: Customer): Promise<AuthResponse> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(USERNAME && PASSWORD ? { Authorization: `Basic ${credentials}` } : {})
    }

    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            username: customer.username,
            password: customer.password,
            email: customer.email,
            phone: customer.phone
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Registration failed')
    }

    return response.json()
}

export const loginCustomer = async (username: string, password: string): Promise<AuthResponse> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(USERNAME && PASSWORD ? { Authorization: `Basic ${credentials}` } : {})
    }

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            username: username,
            password: password
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Login failed')
    }

    return response.json()
}

export const logoutCustomer = async (refreshToken: string): Promise<void> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
        console.error('Logout failed')
    }
}

export const refreshTokens = async (refreshToken: string): Promise<AuthResponse> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Token refresh failed')
    }

    return response.json()
}