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

