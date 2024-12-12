import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FavoriteTopics.css'; // Optional for styling

const FavoriteTopics = () => {
  const topics = ['Philosophy', 'Science', 'Psychology', 'Society', 'Culture'];
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTopicToggle = (topic) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.includes(topic)
        ? prevTopics.filter((t) => t !== topic) // Remove topic if already selected
        : [...prevTopics, topic] // Add topic if not selected
    );
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic.');
      return;
    }
  
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting favorite topics:', selectedTopics);
  
      // Save favorite topics
      await axios.post(
        'https://verbal-backend-0cao.onrender.com/api/users/favorite-topics',
        { topics: selectedTopics },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Fetch recommendations immediately
      const response = await axios.get(
        'https://verbal-backend-0cao.onrender.com/api/essays/recommendations',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const recommendedEssay = response.data[0];
      if (recommendedEssay) {
        console.log('Navigating to recommended essay:', recommendedEssay._id);
        navigate(`/essays/${recommendedEssay._id}`);
      } else {
        console.log('Navigating to essays list');
        navigate('/essays');
      }
    } catch (err) {
      console.error('Error saving topics or fetching recommendations:', err);
      setError('Failed to save your preferences or fetch recommendations.');
    } finally {
      setLoading(false); // Ensure loading is reset
    }
  };
  

  
  

  return (
    <div className="favorite-topics-container">
      <h2>Select Your Favorite Topics</h2>
      <p>Select topics you're most interested in. This will help us personalize your essay recommendations.</p>

      {error && <p className="error-message">{error}</p>}

      <div className="topics-list">
        {topics.map((topic) => (
          <div
            key={topic}
            className={`topic-item ${
              selectedTopics.includes(topic) ? 'selected' : ''
            }`}
            onClick={() => handleTopicToggle(topic)}
          >
            {topic}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="submit-button" disabled={loading}>
        {loading ? 'Loading...' : 'Save and Continue'}
      </button>

    </div>
  );
};

export default FavoriteTopics;
