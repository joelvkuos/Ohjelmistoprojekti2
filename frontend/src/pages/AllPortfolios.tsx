import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import RatingComponent from "../components/RatingComponent";
import { useAuth } from "../context/AuthContext";
import { getAllPortfolios, type Portfolio } from "../services/portfolioService";
import { getMultipleStockQuotes, type StockQuote } from "../services/stockQuoteService";
import "../styles/allPortfolios.css";

export default function AllPortfoliosPage() {
    const { state } = useAuth();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [stockQuotes, setStockQuotes] = useState<Map<string, StockQuote>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllPortfolios = async () => {
            if (!state.accessToken) {
                setError("Not authenticated");
                setLoading(false);
                return;
            }

            try {
                const allPortfolios = await getAllPortfolios(state.accessToken);
                setPortfolios(allPortfolios);

                const tickers = new Set<string>();
                allPortfolios.forEach((portfolio) => {
                    portfolio.holdings?.forEach((holding) => {
                        tickers.add(holding.ticker);
                    });
                });

                if (tickers.size > 0) {
                    try {
                        const quotes = await getMultipleStockQuotes(Array.from(tickers));
                        const quoteMap = new Map(quotes.map((quote) => [quote.ticker, quote]));
                        setStockQuotes(quoteMap);
                    } catch (quoteError) {
                        console.warn("Failed to fetch stock quotes, continuing without", quoteError);
                    }
                }
            } catch (err) {
                setError("Failed to load community portfolios");
            } finally {
                setLoading(false);
            }
        };

        fetchAllPortfolios();
    }, [state.accessToken]);

    return (
        <>
            <Navigation />
            <div className="all-portfolios-container">
                <h1>Community Portfolios</h1>
                <p className="all-portfolios-subtitle">Browse portfolios created by all users.</p>

                {loading && <p>Loading portfolios...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && portfolios.length === 0 && (
                    <div className="no-portfolios">
                        <p>No portfolios available yet.</p>
                    </div>
                )}

                <div>
                    {portfolios.map((portfolio) => (
                        <div key={portfolio.portfolioId} className="portfolio-card">
                            <div className="portfolio-header">
                                <div>
                                    <h3 className="portfolio-name">{portfolio.portfolioName}</h3>
                                    <span className="portfolio-owner">
                                        Owner: {portfolio.user?.username || "Unknown user"}
                                    </span>
                                </div>
                            </div>

                            {portfolio.holdings && portfolio.holdings.length > 0 ? (
                                <div className="holdings-list">
                                    <h4>Holdings:</h4>
                                    {portfolio.holdings.map((holding) => {
                                        const quote = stockQuotes.get(holding.ticker);
                                        const totalValue = quote ? holding.quantity * quote.currentPrice : 0;
                                        const changeColor = quote && quote.change >= 0 ? "#28a745" : "#dc3545";

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
                                                            {quote.change >= 0 ? "+" : ""}
                                                            {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
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
                                <p className="no-holdings-message">No holdings in this portfolio yet.</p>
                            )}

                            <RatingComponent 
                                portfolioId={portfolio.portfolioId} 
                                portfolioOwnerId={portfolio.user?.id}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
