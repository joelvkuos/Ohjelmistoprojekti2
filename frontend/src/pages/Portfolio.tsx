import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPortfolios, createPortfolio, updatePortfolio, deletePortfolio, addHolding, removeHolding, type Portfolio } from "../services/portfolioService";
import { getMultipleStockQuotes, type StockQuote } from "../services/stockQuoteService";
import "../styles/portfolio.css";

export default function PortfolioPage() {
    const { state } = useAuth();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [stockQuotes, setStockQuotes] = useState<Map<string, StockQuote>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPortfolioName, setNewPortfolioName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
    const [showEditPortfolioModal, setShowEditPortfolioModal] = useState(false);
    const [editPortfolioName, setEditPortfolioName] = useState("");
    const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
    const [showAddHoldingModal, setShowAddHoldingModal] = useState(false);
    const [newTicker, setNewTicker] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [isAddingHolding, setIsAddingHolding] = useState(false);

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

    const handleCreatePortfolio = async () => {
        if (!newPortfolioName.trim()) {
            setError("Portfolio name cannot be empty");
            return;
        }

        if (!state.accessToken) {
            setError("Not authenticated");
            return;
        }

        setIsCreating(true);
        try {
            await createPortfolio(
                { portfolioName: newPortfolioName },
                state.accessToken
            );

            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            setPortfolios(updatedPortfolios);

            setShowCreateModal(false);
            setNewPortfolioName("");
            setError("");
        } catch (err) {
            setError("Failed to create portfolio");
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleOpenEditPortfolio = () => {
        if (selectedPortfolio) {
            setEditPortfolioName(selectedPortfolio.portfolioName);
            setShowEditPortfolioModal(true);
        }
    };

    const handleSaveEditPortfolio = async () => {
        if (!editPortfolioName.trim()) {
            setError("Portfolio name cannot be empty");
            return;
        }

        if (!state.accessToken || !selectedPortfolio) {
            setError("Not authenticated");
            return;
        }

        setIsEditingPortfolio(true);
        try {
            await updatePortfolio(
                selectedPortfolio.portfolioId,
                { portfolioName: editPortfolioName },
                state.accessToken
            );

            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            setPortfolios(updatedPortfolios);

            setShowEditPortfolioModal(false);
            setSelectedPortfolio(null);
            setError("");
        } catch (err) {
            setError("Failed to update portfolio");
            console.error(err);
        } finally {
            setIsEditingPortfolio(false);
        }
    };

    const handleDeletePortfolio = async () => {
        if (!window.confirm("Are you sure you want to delete this portfolio?")) {
            return;
        }

        if (!state.accessToken || !selectedPortfolio) {
            setError("Not authenticated");
            return;
        }

        try {
            await deletePortfolio(selectedPortfolio.portfolioId, state.accessToken);

            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            setPortfolios(updatedPortfolios);

            setSelectedPortfolio(null);
            setError("");
        } catch (err) {
            setError("Failed to delete portfolio");
            console.error(err);
        }
    };

    const handleAddHolding = async () => {
        if (!newTicker.trim()) {
            setError("Ticker cannot be empty");
            return;
        }

        if (!newQuantity || parseFloat(newQuantity) <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }

        if (!state.accessToken || !selectedPortfolio) {
            setError("Not authenticated");
            return;
        }

        setIsAddingHolding(true);
        try {
            await addHolding(
                {
                    ticker: newTicker.toUpperCase(),
                    quantity: parseFloat(newQuantity),
                    portfolio: { portfolioId: selectedPortfolio.portfolioId }
                },
                state.accessToken
            );

            // Refresh the portfolio
            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            const updated = updatedPortfolios.find(p => p.portfolioId === selectedPortfolio.portfolioId);
            if (updated) {
                setSelectedPortfolio(updated);
            }
            setPortfolios(updatedPortfolios);

            setShowAddHoldingModal(false);
            setNewTicker("");
            setNewQuantity("");
            setError("");
        } catch (err) {
            setError("Failed to add holding");
            console.error(err);
        } finally {
            setIsAddingHolding(false);
        }
    };

    const handleRemoveHolding = async (holdingId: number) => {
        if (!window.confirm("Are you sure you want to remove this holding?")) {
            return;
        }

        if (!state.accessToken || !selectedPortfolio) {
            setError("Not authenticated");
            return;
        }

        try {
            await removeHolding(holdingId, state.accessToken);

            // Refresh the portfolio
            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            const updated = updatedPortfolios.find(p => p.portfolioId === selectedPortfolio.portfolioId);
            if (updated) {
                setSelectedPortfolio(updated);
            }
            setPortfolios(updatedPortfolios);
            setError("");
        } catch (err) {
            setError("Failed to remove holding");
            console.error(err);
        }
    };

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
                    </div>
                )}
                <button 
                    className="create-portfolio-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create Portfolio
                </button>

                <div>
                    {portfolios.map((portfolio) => (
                        <div
                            key={portfolio.portfolioId}
                            className="portfolio-card"
                            onClick={() => setSelectedPortfolio(portfolio)}
                            style={{ cursor: 'pointer' }}
                        >
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

                {/* Portfolio Detail View */}
                {selectedPortfolio && (
                    <div className="modal-overlay" onClick={() => setSelectedPortfolio(null)}>
                        <div className="portfolio-detail-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="detail-header">
                                <h2>{selectedPortfolio.portfolioName}</h2>
                                <button className="close-btn" onClick={() => setSelectedPortfolio(null)}>×</button>
                            </div>

                            <div className="detail-actions">
                                <button 
                                    className="action-btn edit-btn"
                                    onClick={handleOpenEditPortfolio}
                                >
                                    Edit Portfolio
                                </button>
                                <button 
                                    className="action-btn delete-btn"
                                    onClick={handleDeletePortfolio}
                                >
                                    Delete Portfolio
                                </button>
                            </div>

                            <div className="holdings-section">
                                <div className="holdings-header">
                                    <h3>Holdings</h3>
                                    <button 
                                        className="add-holding-btn"
                                        onClick={() => setShowAddHoldingModal(true)}
                                    >
                                        + Add Stock
                                    </button>
                                </div>

                                {selectedPortfolio.holdings && selectedPortfolio.holdings.length > 0 ? (
                                    <div className="holdings-detail-list">
                                        {selectedPortfolio.holdings.map((holding) => {
                                            const quote = stockQuotes.get(holding.ticker);
                                            const totalValue = quote ? holding.quantity * quote.currentPrice : 0;

                                            return (
                                                <div key={holding.holdingsId} className="holding-detail-item">
                                                    <div className="holding-detail-info">
                                                        <span className="detail-ticker">{holding.ticker}</span>
                                                        <span className="detail-quantity">{holding.quantity} shares</span>
                                                        {quote && (
                                                            <span className="detail-value">Total: ${totalValue.toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                    <button 
                                                        className="remove-holding-btn"
                                                        onClick={() => handleRemoveHolding(holding.holdingsId)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="no-holdings">No holdings in this portfolio yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Portfolio Modal */}
                {showEditPortfolioModal && (
                    <div className="modal-overlay" onClick={() => setShowEditPortfolioModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Edit Portfolio Name</h2>
                            <input
                                type="text"
                                placeholder="Enter new portfolio name"
                                value={editPortfolioName}
                                onChange={(e) => setEditPortfolioName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEditPortfolio()}
                                disabled={isEditingPortfolio}
                            />
                            <div className="modal-buttons">
                                <button
                                    className="modal-btn create-btn"
                                    onClick={handleSaveEditPortfolio}
                                    disabled={isEditingPortfolio}
                                >
                                    {isEditingPortfolio ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    className="modal-btn cancel-btn"
                                    onClick={() => setShowEditPortfolioModal(false)}
                                    disabled={isEditingPortfolio}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Holding Modal */}
                {showAddHoldingModal && selectedPortfolio && (
                    <div className="modal-overlay" onClick={() => setShowAddHoldingModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Add Stock to {selectedPortfolio.portfolioName}</h2>
                            <input
                                type="text"
                                placeholder="Stock Ticker (e.g., AAPL)"
                                value={newTicker}
                                onChange={(e) => setNewTicker(e.target.value)}
                                disabled={isAddingHolding}
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddHolding()}
                                disabled={isAddingHolding}
                                min="0.01"
                                step="0.01"
                            />
                            <div className="modal-buttons">
                                <button
                                    className="modal-btn create-btn"
                                    onClick={handleAddHolding}
                                    disabled={isAddingHolding}
                                >
                                    {isAddingHolding ? 'Adding...' : 'Add Stock'}
                                </button>
                                <button
                                    className="modal-btn cancel-btn"
                                    onClick={() => setShowAddHoldingModal(false)}
                                    disabled={isAddingHolding}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Portfolio Modal */}
                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Create New Portfolio</h2>
                            <input
                                type="text"
                                placeholder="Enter portfolio name"
                                value={newPortfolioName}
                                onChange={(e) => setNewPortfolioName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCreatePortfolio()}
                                disabled={isCreating}
                            />
                            <div className="modal-buttons">
                                <button
                                    className="modal-btn create-btn"
                                    onClick={handleCreatePortfolio}
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creating...' : 'Create'}
                                </button>
                                <button
                                    className="modal-btn cancel-btn"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
