import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import type { AuthState } from '../types/api.types'

interface AuthContextType {
    state: AuthState;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string, email: string, phone: string) => Promise<void>;
    refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: AuthState['user']; accessToken: string; refreshToken: string }
    | { type: 'LOGIN_ERROR'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'REGISTER_START' }
    | { type: 'REGISTER_SUCCESS' }
    | { type: 'REGISTER_ERROR'; payload: string }
    | { type: 'RESTORE_TOKEN'; payload: { user: AuthState['user']; accessToken: string; refreshToken: string } }
    | { type: 'REFRESH_TOKEN'; payload: string }

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: true,
    error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN_START':
        case 'REGISTER_START':
            return {
                ...state,
                loading: true,
                error: null,
            }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                accessToken: action.accessToken,
                refreshToken: action.refreshToken,
                loading: false,
                error: null,
            }
        case 'LOGIN_ERROR':
        case 'REGISTER_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case 'LOGOUT':
            return {
                ...initialState,
                loading: false,
            }
        case 'RESTORE_TOKEN':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                loading: false,
            }
        case 'REFRESH_TOKEN':
            return {
                ...state,
                accessToken: action.payload,
            }
        default:
            return state
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // Restoroi token sovelluksen käynnistyessä
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken')
                const expiresAt = localStorage.getItem('expiresAt')
                const userJson = localStorage.getItem('user')

                // Tarkista että token on voimassa
                if (accessToken && expiresAt) {
                    const now = new Date()
                    const expireTime = new Date(expiresAt)
                    
                    if (now < expireTime) {
                        // Token on edelleen voimassa, restoroi käyttäjätiedot
                        let user = null
                        try {
                            user = userJson ? JSON.parse(userJson) : { id: 0, username: 'User', email: '' }
                        } catch (e) {
                            user = { id: 0, username: 'User', email: '' }
                        }
                        
                        dispatch({
                            type: 'RESTORE_TOKEN',
                            payload: { user, accessToken, refreshToken: accessToken },
                        })
                        return
                    }
                }
                
                dispatch({ type: 'LOGOUT' })
            } catch (e) {
                console.error('Failed to restore token', e)
                dispatch({ type: 'LOGOUT' })
            }
        }

        bootstrapAsync()
    }, [])

    const login = useCallback(async (username: string, password: string) => {
        dispatch({ type: 'LOGIN_START' })
        try {
            const response = await fetch('https://stockfolio-postgres-stockfolio-postgres.2.rahtiapp.fi/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || 'Login failed')
            }

            const data = await response.json()

            // Tallenna tokens localStorage:hen
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('expiresAt', data.expiresAt || new Date(Date.now() + 3600000).toISOString())
            
            const user = { id: 0, username: username, email: '' }
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('refreshToken', data.accessToken)

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: user,
                accessToken: data.accessToken,
                refreshToken: data.accessToken,
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed'
            dispatch({ type: 'LOGIN_ERROR', payload: message })
            throw error
        }
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('expiresAt')
        dispatch({ type: 'LOGOUT' })
    }, [])

    const register = useCallback(async (username: string, password: string, email: string, phone: string) => {
        dispatch({ type: 'REGISTER_START' })
        try {
            const response = await fetch('https://stockfolio-postgres-stockfolio-postgres.2.rahtiapp.fi/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, phone }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || 'Registration failed')
            }

            dispatch({ type: 'REGISTER_SUCCESS' })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed'
            dispatch({ type: 'REGISTER_ERROR', payload: message })
            throw error
        }
    }, [])

    const refreshAccessToken = useCallback(async () => {
        if (!state.refreshToken) {
            logout()
            return null
        }

        try {
            const response = await fetch('https://stockfolio-postgres-stockfolio-postgres.2.rahtiapp.fi/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: state.refreshToken }),
            })

            if (!response.ok) {
                logout()
                return null
            }

            const data = await response.json()
            localStorage.setItem('accessToken', data.accessToken)
            dispatch({
                type: 'REFRESH_TOKEN',
                payload: data.accessToken,
            })

            // Palauta uusi token
            return data.accessToken
        } catch (error) {
            console.error('Failed to refresh token', error)
            logout()
            return null
        }
    }, [state.refreshToken, logout])

    const value: AuthContextType = {
        state,
        login,
        logout,
        register,
        refreshAccessToken,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}