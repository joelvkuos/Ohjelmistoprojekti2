/** Fetch konfiguraatio */

import { useAuth } from '../context/AuthContext'

const API_URL = 'https://stockfolio-postgres-stockfolio-postgres.2.rahtiapp.fi/api'

interface FetchOptions extends RequestInit {
    requiresAuth?: boolean
}

export function useApiClient() {
    const { state, refreshAccessToken } = useAuth()

    const fetchWithAuth = async (endpoint: string, options: FetchOptions = {}) => {
        const { requiresAuth = true, ...fetchOptions } = options

        let headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        }

        // Lisää access token jos vaaditaan autentikointia
        if (requiresAuth && state.accessToken) {
            headers = {
                ...headers,
                Authorization: `Bearer ${state.accessToken}`,
            }
        }

        let response = await fetch(`${API_URL}${endpoint}`, {
            ...fetchOptions,
            headers,
        })

        // Jos 401 (Unauthorized), yritä refreshata token
        if (response.status === 401 && state.refreshToken) {
            const newAccessToken = await refreshAccessToken()

            // Yritä uudelleen uudella tokenilla
            if (newAccessToken) {
                const newHeaders = new Headers(fetchOptions.headers)
                newHeaders.set('Content-Type', 'application/json')
                newHeaders.set('Authorization', `Bearer ${newAccessToken}`)

                response = await fetch(`${API_URL}${endpoint}`, {
                    ...fetchOptions,
                    headers: newHeaders,
                })
            }
        }

        if (!response.ok) {
            const error = await response.text()
            throw new Error(error || `HTTP Error: ${response.status}`)
        }

        return response.json()
    }

    return { fetchWithAuth }
}

// Helper funktio API kutsuja varten ilman React hookia
export async function fetchAPI(
    endpoint: string,
    options: FetchOptions = {},
    accessToken?: string
) {
    const { requiresAuth = true, ...fetchOptions } = options

    let headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    }

    if (requiresAuth && accessToken) {
        headers = {
            ...headers,
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(error || `HTTP Error: ${response.status}`)
    }

    return response.json()
}