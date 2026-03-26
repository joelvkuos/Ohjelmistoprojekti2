/** API tyypit */

export interface Customer {
    username: string;
    password: string;
    email: string;
    phone: string;
}

export interface NewsArticle {
    id: number;
    category: string;
    datetime: number;
    headline: string;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
}

export interface TokenPayload {
    accessToken: string;
    refreshToken: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: number;
        username: string;
        email: string;
    } | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}
