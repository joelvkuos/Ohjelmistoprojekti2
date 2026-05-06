import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPortfolios, createPortfolio, updatePortfolio, deletePortfolio, addHolding, updateHolding, removeHolding, type Portfolio } from "../services/portfolioService";
import { getMultipleStockQuotes, type StockQuote } from "../services/stockQuoteService";
import { searchStock } from "../services/stockService";
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
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedStock, setSelectedStock] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showEditHoldingModal, setShowEditHoldingModal] = useState(false);
    const [editingHolding, setEditingHolding] = useState<any>(null);
    const [editHoldingQuantity, setEditHoldingQuantity] = useState("");
    const [isEditingHolding, setIsEditingHolding] = useState(false);

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
        if (!newTicker.trim() || !selectedStock) {
            setError("Please select a stock");
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
        setError("");

        try {
            const ticker = newTicker.toUpperCase().trim();
            const quantity = parseFloat(newQuantity);

            const payload = {
                ticker: ticker,
                quantity: quantity,
                portfolioId: selectedPortfolio.portfolioId
            };

            console.log("Sending add holding payload:", payload);

            await addHolding(payload, state.accessToken);

            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            setPortfolios(updatedPortfolios);

            const refreshedPortfolio = updatedPortfolios.find(
                p => p.portfolioId === selectedPortfolio.portfolioId
            );

            if (refreshedPortfolio) {
                setSelectedPortfolio(refreshedPortfolio);
            }

            handleCloseAddHoldingModal();
            setError("");
        } catch (err: any) {
            console.error("Add holding error:", err);
            const errorMsg = err.response?.data?.message 
                        || err.response?.data?.error 
                        || "Failed to add holding";
            setError(errorMsg);
        } finally {
            setIsAddingHolding(false);
        }
    };

    const handleOpenEditHoldingModal = (holding: any) => {
        setEditingHolding(holding);
        setEditHoldingQuantity("");
        setShowEditHoldingModal(true);
    };

    const handleCloseEditHoldingModal = () => {
        setShowEditHoldingModal(false);
        setEditingHolding(null);
        setEditHoldingQuantity("");
    };

    const handleSellAll = async () => {
        if (!state.accessToken || !editingHolding || !selectedPortfolio) {
            setError("Not authenticated or no holding selected");
            return;
        }

        setIsEditingHolding(true);
        setError("");

        try {
            await removeHolding(editingHolding.holdingsId, state.accessToken);

            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            setPortfolios(updatedPortfolios);

            const refreshedPortfolio = updatedPortfolios.find(
                p => p.portfolioId === selectedPortfolio.portfolioId
            );

            if (refreshedPortfolio) {
                setSelectedPortfolio(refreshedPortfolio);
            }

            handleCloseEditHoldingModal();
            setError("");
        } catch (err: any) {
            console.error("Sell all error:", err);
            const errorMsg = err.response?.data?.message || "Failed to sell all holdings";
            setError(errorMsg);
        } finally {
            setIsEditingHolding(false);
        }
    };

    const handleBuyAmount = async () => {
        if (!editHoldingQuantity || parseFloat(editHoldingQuantity) <= 0) {
            setError("Please enter a valid amount to buy");
            return;
        }

        if (!state.accessToken || !editingHolding || !selectedPortfolio) {
            setError("Not authenticated");
            return;
        }

        setIsEditingHolding(true);
        setError("");

        try {
            const buyAmount = parseFloat(editHoldingQuantity);

            const payload = {
                ticker: editingHolding.ticker,
                quantity: editingHolding.quantity + buyAmount,
                portfolioId: selectedPortfolio.portfolioId
            };

            await updateHolding(editingHolding.holdingsId, payload, state.accessToken);

            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            setPortfolios(updatedPortfolios);

            const refreshedPortfolio = updatedPortfolios.find(
                p => p.portfolioId === selectedPortfolio.portfolioId
            );
            if (refreshedPortfolio) {
                setSelectedPortfolio(refreshedPortfolio);
            }

            handleCloseEditHoldingModal();
            setError("");
        } catch (err: any) {
            console.error("Buy holding error:", err);
            const errorMsg = err.response?.data?.message || "Failed to buy holdings";
            setError(errorMsg);
        } finally {
            setIsEditingHolding(false);
        }
    };

    const handleSellAmount = async () => {
        if (!editHoldingQuantity || parseFloat(editHoldingQuantity) <= 0) {
            setError("Please enter a valid amount to sell");
            return;
        }

        if (!state.accessToken || !editingHolding || !selectedPortfolio) {
            setError("Not authenticated");
            return;
        }

        const sellAmount = parseFloat(editHoldingQuantity);
        if (sellAmount > editingHolding.quantity) {
            setError("Cannot sell more than you own");
            return;
        }

        setIsEditingHolding(true);
        setError("");

        try {
            const newQuantity = editingHolding.quantity - sellAmount;

            if (newQuantity <= 0) {
                await removeHolding(editingHolding.holdingsId, state.accessToken);
            } else {
                const payload = {
                    ticker: editingHolding.ticker,
                    quantity: newQuantity,
                    portfolioId: selectedPortfolio.portfolioId
                };

                await updateHolding(editingHolding.holdingsId, payload, state.accessToken);
            }

            const updatedPortfolios = await getMyPortfolios(state.accessToken);
            setPortfolios(updatedPortfolios);

            const refreshedPortfolio = updatedPortfolios.find(
                p => p.portfolioId === selectedPortfolio.portfolioId
            );
            if (refreshedPortfolio) {
                setSelectedPortfolio(refreshedPortfolio);
            }

            handleCloseEditHoldingModal();
            setError("");
        } catch (err: any) {
            console.error("Sell holding error:", err);
            const errorMsg = err.response?.data?.message || "Failed to sell holdings";
            setError(errorMsg);
        } finally {
            setIsEditingHolding(false);
        }
    };

    const handleSearchStock = async (query: string) => {
        setSearchQuery(query);
        if (query.trim().length < 1) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await searchStock(query);
            setSearchResults(results.slice(0, 10)); // Limit to 10 results
        } catch (err) {
            console.error('Error searching stocks:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectStock = (stock: any) => {
        setSelectedStock(stock);
        setNewTicker(stock.symbol);
        setSearchQuery(stock.symbol);
        setSearchResults([]);
    };

    const handleOpenAddHoldingModal = () => {
        setShowAddHoldingModal(true);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedStock(null);
        setNewTicker("");
        setNewQuantity("");
    };

    const handleCloseAddHoldingModal = () => {
        setShowAddHoldingModal(false);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedStock(null);
        setNewTicker("");
        setNewQuantity("");
    };

    const calculatePortfolioTotal = (portfolio: Portfolio): number => {
        if (!portfolio.holdings || portfolio.holdings.length === 0) return 0;
        
        let total = 0;
        portfolio.holdings.forEach(holding => {
            const quote = stockQuotes.get(holding.ticker);
            if (quote) {
                total += holding.quantity * quote.currentPrice;
            }
        });
        return total;
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
                {portfolios.map((portfolio) => {
                    const portfolioTotal = calculatePortfolioTotal(portfolio);
                    
                    return (
                        <div
                            key={portfolio.portfolioId}
                            className="portfolio-card"
                        >
                            <div className="portfolio-header">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, marginRight: '1rem' }}>
                                    <h3 className="portfolio-name" style={{ margin: 0 }}>{portfolio.portfolioName}</h3>
                                </div>
                                <button
                                    className="edit-portfolio-card-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPortfolio(portfolio);
                                    }}
                                >
                                    Edit
                                </button>
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
                                                ) : loading ? (
                                                    <span className="holding-loading">Loading price...</span>
                                                ) : (
                                                    <span className="holding-unavailable">Price unavailable</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div className="portfolio-summary">
                                        Portfolio Total: ${portfolioTotal.toFixed(2)}
                                    </div>
                                </div>
                            ) : (
                                <p>No holdings in this portfolio yet.</p>
                            )}
                        </div>
                    );
                })}
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
                                        onClick={handleOpenAddHoldingModal}
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
                                                        className="edit-holding-btn"
                                                        onClick={() => handleOpenEditHoldingModal(holding)}
                                                    >
                                                        Edit
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
                    <div className="modal-overlay" onClick={handleCloseAddHoldingModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Add Stock to {selectedPortfolio.portfolioName}</h2>
                            
                            {/* Stock Search */}
                            <div className="stock-search-section">
                                <input
                                    type="text"
                                    placeholder="Search stocks by ticker or company name..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchStock(e.target.value)}
                                    disabled={isAddingHolding}
                                />
                                {isSearching && <p className="searching-text">Searching...</p>}
                                
                                {searchResults.length > 0 && (
                                    <div className="search-results-dropdown">
                                        {searchResults.map((stock, index) => (
                                            <div 
                                                key={index} 
                                                className={`search-result-item ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
                                                onClick={() => handleSelectStock(stock)}
                                            >
                                                <div className="result-symbol">{stock.symbol}</div>
                                                <div className="result-description">{stock.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Stock Info */}
                            {selectedStock && (
                                <div className="selected-stock-info">
                                    <p><strong>Symbol:</strong> {selectedStock.symbol}</p>
                                    <p><strong>Company:</strong> {selectedStock.description}</p>
                                </div>
                            )}

                            {/* Quantity Input */}
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddHolding()}
                                disabled={isAddingHolding || !selectedStock}
                                min="0.01"
                                step="0.01"
                            />

                            <div className="modal-buttons">
                                <button
                                    className="modal-btn create-btn"
                                    onClick={handleAddHolding}
                                    disabled={isAddingHolding || !selectedStock}
                                >
                                    {isAddingHolding ? 'Adding...' : 'Add Stock'}
                                </button>
                                <button
                                    className="modal-btn cancel-btn"
                                    onClick={handleCloseAddHoldingModal}
                                    disabled={isAddingHolding}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Holding Modal */}
                {showEditHoldingModal && editingHolding && (
                    <div className="modal-overlay" onClick={handleCloseEditHoldingModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Edit Holding: {editingHolding.ticker}</h2>
                            <p className="holding-info-text">Current quantity: {editingHolding.quantity} shares</p>
                            
                            <div className="edit-holding-section">
                                <label>Amount:</label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={editHoldingQuantity}
                                    onChange={(e) => setEditHoldingQuantity(e.target.value)}
                                    disabled={isEditingHolding}
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>

                            <div className="modal-buttons">
                                <button
                                    className="modal-btn sell-btn"
                                    onClick={handleSellAmount}
                                    disabled={isEditingHolding || !editHoldingQuantity}
                                >
                                    {isEditingHolding ? 'Processing...' : 'Sell Amount'}
                                </button>
                                <button
                                    className="modal-btn buy-btn"
                                    onClick={handleBuyAmount}
                                    disabled={isEditingHolding || !editHoldingQuantity}
                                >
                                    {isEditingHolding ? 'Processing...' : 'Buy Amount'}
                                </button>
                                <button
                                    className="modal-btn delete-btn"
                                    onClick={handleSellAll}
                                    disabled={isEditingHolding}
                                >
                                    {isEditingHolding ? 'Processing...' : 'Sell All'}
                                </button>
                                <button
                                    className="modal-btn cancel-btn"
                                    onClick={handleCloseEditHoldingModal}
                                    disabled={isEditingHolding}
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
