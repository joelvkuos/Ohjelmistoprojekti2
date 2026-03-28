import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPortfolios, type Portfolio } from "../services/portfolioService";
import { getMultipleStockQuotes, type StockQuote } from "../services/stockQuoteService";
import "../styles/portfolio.css";

export default function PortfolioPage() {
    const { state } = useAuth();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [stockQuotes, setStockQuotes] = useState<Map<string, StockQuote>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPortfolios = async () => {
            if (!state.accessToken) {
                setError("Not authenticated");
                setLoading(false);
                return;
            }

            try {
                const userPortfolios = await getMyPortfolios(state.accessToken);
                setPortfolios(userPortfolios);

                // Collect all unique tickers from portfolios
                const tickers = new Set<string>();
                userPortfolios.forEach(portfolio => {
                    portfolio.holdings?.forEach(holding => {
                        tickers.add(holding.ticker);
                    });
                });

                // Fetch quotes for all tickers
                if (tickers.size > 0) {
                    try {
                        const quotes = await getMultipleStockQuotes(Array.from(tickers));
                        const quoteMap = new Map(quotes.map(q => [q.ticker, q]));
                        setStockQuotes(quoteMap);
                    } catch (quoteError) {
                        console.warn("Failed to fetch stock quotes, continuing without", quoteError);
                        // Don't fail completely if quotes fail to load
                    }
                }
            } catch (err) {
                setError("Failed to load portfolios");
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolios();
    }, [state.accessToken]);

    return (
        <>
            <Navigation />
            <div className="portfolio-container">
                <h1>My Portfolios</h1>
                {loading && <p>Loading portfolios...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && portfolios.length === 0 && (
                    <div className="no-portfolios">
                        <p>You don't have any portfolios yet.</p>
                        <button className="create-portfolio-btn">Create Portfolio</button>
                    </div>
                )}

                <div>
                    {portfolios.map((portfolio) => (
                        <div key={portfolio.portfolioId} className="portfolio-card">
                            <div className="portfolio-header">
                                <h3 className="portfolio-name">{portfolio.portfolioName}</h3>
                                <span>Portfolio ID: {portfolio.portfolioId}</span>
                            </div>

                            {portfolio.holdings && portfolio.holdings.length > 0 ? (
                                <div className="holdings-list">
                                    <h4>Holdings:</h4>
                                    {portfolio.holdings.map((holding) => {
                                        const quote = stockQuotes.get(holding.ticker);
                                        const totalValue = quote ? holding.quantity * quote.currentPrice : 0;
                                        const changeColor = quote && quote.change >= 0 ? '#28a745' : '#dc3545';

                                        return (
                                            <div key={holding.holdingsId} className="holding-item">
                                                <div className="holding-info">
                                                    <span className="holding-ticker">{holding.ticker}</span>
                                                    <span className="holding-quantity">Qty: {holding.quantity}</span>
                                                </div>
                                                {quote ? (
                                                    <div className="holding-price-info">
                                                        <span className="holding-price">${quote.currentPrice.toFixed(2)}</span>
                                                        <span className="holding-change" style={{ color: changeColor }}>
                                                            {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                                                        </span>
                                                        <span className="holding-total">Value: ${totalValue.toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="holding-loading">Loading price...</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>No holdings in this portfolio yet.</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
