import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { addOrUpdateRating, getAverageRating, getUserRating, deleteRating } from "../services/ratingService";
import "../styles/rating.css";

interface RatingComponentProps {
    portfolioId: number;
    portfolioOwnerId?: number;
}

export default function RatingComponent({ portfolioId, portfolioOwnerId }: RatingComponentProps) {
    const { state } = useAuth();
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [ratingCount, setRatingCount] = useState<number>(0);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const isPortfolioOwner = portfolioOwnerId && state.user?.id === portfolioOwnerId;

    useEffect(() => {
        const fetchRatingData = async () => {
            if (!state.accessToken) {
                setLoading(false);
                return;
            }

            try {
                
                const avgResponse = await getAverageRating(portfolioId, state.accessToken);
                setAverageRating(avgResponse.average);
                setRatingCount(avgResponse.count);

                
                if (!isPortfolioOwner) {
                    try {
                        const userRatingData = await getUserRating(portfolioId, state.accessToken);
                        if (userRatingData) {
                            setUserRating(userRatingData.ratingValue);
                        }
                    } catch (err) {
                        
                        setUserRating(null);
                    }
                }
            } catch (err) {
                setError("Failed to load ratings");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRatingData();
    }, [portfolioId, state.accessToken, isPortfolioOwner, state.user?.id]);

    const handleRating = async (value: number) => {
        if (!state.accessToken) return;

        if (isPortfolioOwner) {
            setError("Cannot rate your own portfolio");
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            await addOrUpdateRating(portfolioId, value, state.accessToken);
            setUserRating(value);

            const avgResponse = await getAverageRating(portfolioId, state.accessToken);
            setAverageRating(avgResponse.average);
            setRatingCount(avgResponse.count);
        } catch (err) {
            setError("Failed to submit rating");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRating = async () => {
        if (!state.accessToken) return;

        setSubmitting(true);
        try {
            await deleteRating(portfolioId, state.accessToken);
            setUserRating(null);

            const avgResponse = await getAverageRating(portfolioId, state.accessToken);
            setAverageRating(avgResponse.average);
            setRatingCount(avgResponse.count);
        } catch (err) {
            setError("Failed to delete rating");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="rating-container">Loading ratings...</div>;
    }

    return (
        <div className="rating-container">
            <div className="rating-display">
                {averageRating !== null ? (
                    <>
                        <div className="average-rating">
                            <span className="rating-value">
                                {averageRating.toFixed(1)}
                            </span>
                            <span className="rating-stars">
                                {renderStars(Math.round(averageRating))}
                            </span>
                        </div>
                        <span className="rating-count">
                            {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
                        </span>
                    </>
                ) : (
                    <span className="no-ratings">No ratings yet</span>
                )}
            </div>

            {!isPortfolioOwner && state.accessToken && (
                <div className="rating-input">
                    <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className={`star-button ${userRating && star <= userRating ? "active" : ""}`}
                                onClick={() => handleRating(star)}
                                disabled={submitting}
                                title={`Rate ${star} out of 5`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    {userRating && (
                        <button
                            className="delete-rating-button"
                            onClick={handleDeleteRating}
                            disabled={submitting}
                        >
                            Delete rating
                        </button>
                    )}
                </div>
            )}

            {isPortfolioOwner && (
                <div className="portfolio-owner-message">
                    You own this portfolio!
                </div>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

function renderStars(rating: number): string {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += i < rating ? "★" : "☆";
    }
    return stars;
}
