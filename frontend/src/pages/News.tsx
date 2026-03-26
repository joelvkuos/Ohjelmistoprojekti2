import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { getMarketNews, type NewsArticle } from "../services/newsService";
import "../styles/news.css";

export default function News() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const news = await getMarketNews('general', 20);
                setArticles(news);
            } catch (err) {
                setError("Failed to load news articles");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
    <>
    <Navigation />
        <div className="news-container">
            <h1>Market News</h1>
            {loading && <p>Loading news...</p>}
            {error && <p className="error-message">{error}</p>}
            
            <div>
                {articles.map((article) => (
                    <div key={article.id} className="article-card">
                        <h3>{article.headline}</h3>
                        {article.image && <img src={article.image} alt={article.headline} className="article-image" />}
                        <p>{article.summary}</p>
                        <small>Source: {article.source} | {new Date(article.datetime * 1000).toLocaleDateString()}</small>
                        <br />
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                    </div>
                ))}
            </div>
        </div>
    <Footer />
    </>
    )
}