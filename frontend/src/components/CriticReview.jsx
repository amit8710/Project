import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CriticReview.css"; // Import your CSS file

const CriticReview = () => {
  const { title } = useParams(); // Get the movie title from the URL
  const [reviews, setReviews] = useState([]);
  const [visibleComments, setVisibleComments] = useState(5); // Initially show 5 comments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCriticReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/movies/${title}`);
        if (!response.ok) {
          throw new Error("Critic reviews not found");
        }
        const data = await response.json();
        const comments = data.comments;

        setReviews(comments); // Set the comments (reviews)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCriticReviews();
  }, [title]);

  // Function to show more comments
  const handleShowMore = () => {
    setVisibleComments((prevVisible) => prevVisible + 10); // Show 10 more comments
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="critic-reviews">
      <h2>Critic Reviews for {title}</h2>

      <div className="meta-score">
        <p>
          <strong>Metascore:</strong> 62
        </p>
        <div className="score-bar">
          <span className="positive">50% Positive</span>
          <span className="mixed">46% Mixed</span>
          <span className="negative">4% Negative</span>
        </div>
      </div>

      <div className="reviews-section">
        {reviews.length > 0 ? (
          reviews.slice(0, visibleComments).map(
            (
              r,
              index // Display only 'visibleComments' number of reviews
            ) => (
              <div key={index} className="review-card">
                <div className="review-score">{r.score}</div>
                <div className="review-content">
                  <p>
                    <strong>{r.name}</strong>
                  </p>
                  <p>{r.review}</p>
                </div>
              </div>
            )
          )
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      {/* Show "Show More" button if there are more comments to display */}
      {visibleComments < reviews.length && (
        <button onClick={handleShowMore} className="show-more-btn">
          Show More
        </button>
      )}
    </div>
  );
};

export default CriticReview;
