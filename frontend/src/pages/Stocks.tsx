import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { getStockQuote, searchStock, getCompanyProfile, type Stock } from '../services/stockService'
import '../styles/stocks.css'

const POPULAR_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']

export default function Stocks() {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])

    const loadDefaultStocks = async () => {
        try {
            setLoading(true)
            const stockData = await Promise.all(
                POPULAR_STOCKS.map(async (symbol) => {
                    const quote = await getStockQuote(symbol)
                    const profile = await getCompanyProfile(symbol)
                    return {
                        ...quote,
                        logo: profile?.logo,
                        name: profile?.name
                    }
                })
            )
            setStocks(stockData)
        } catch (err) {
            setError('Failed to load stocks')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDefaultStocks()
    }, [])

    const handleSearch = async (e: any) => {
        const value = e.target.value
        setSearchQuery(value)

        if (value.length > 1) {
            try {
                const results = await searchStock(value)
                setSearchResults(results.slice(0, 5))
            } catch (err) {
                setSearchResults([])
            }
        } else {
            setSearchResults([])
            if (value === '') {
                loadDefaultStocks()
            }
        }
    }

    const handleSelectStock = async (symbol: string) => {
        try {
            setError('')
            setLoading(true)
            const quote = await getStockQuote(symbol)
            const profile = await getCompanyProfile(symbol)
            const newStock = {
                ...quote,
                logo: profile?.logo,
                name: profile?.name
            }
            setStocks([newStock])
            setSearchQuery('')
            setSearchResults([])
        } catch (err: any) {
            setError(err.message || 'Failed to load stock. This stock may not be available on the free plan.')
            setStocks([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navigation />
            <div className="stocks-container">
                <h1 onClick={() => loadDefaultStocks()} style={{ cursor: 'pointer' }}>Stock Market</h1>

                {error && <p className="error-message">{error}</p>}

                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search for a stock..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map((result) => (
                                <div
                                    key={result.symbol}
                                    className="search-item"
                                    onClick={() => handleSelectStock(result.symbol)}
                                >
                                    <strong>{result.displaySymbol}</strong> - {result.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {loading ? (
                    <p>Loading stocks...</p>
                ) : (
                    <div>
                        {stocks.map((stock) => (
                            <div key={stock.symbol} className="stock-card">
                                <div className="stock-header">
                                    <div className="stock-info">
                                        {stock.logo && <img src={stock.logo} alt={stock.name} className="company-logo" />}
                                        <div>
                                            <h3>{stock.symbol}</h3>
                                            <p className="company-name">{stock.name}</p>
                                        </div>
                                    </div>
                                    <div className="stock-price">
                                        <p className="price">${stock.price.toFixed(2)}</p>
                                        <p
                                            className="change"
                                            style={{
                                                color: stock.changePercent >= 0 ? '#22c55e' : '#ef4444'
                                            }}
                                        >
                                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                                <p className="stock-change">
                                    Change: {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}