import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Ensure the CSS file is imported

const Dashboard = () => {
  const [userData, setUserData] = useState({
    streak: { current: 0, lastActiveDate: null },
    completedEssays: [],
  });

  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserData({
          streak: response.data?.streak || { current: 0, lastActiveDate: null },
          completedEssays: response.data?.completedEssays || [],
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserData({
          streak: { current: 0, lastActiveDate: null },
          completedEssays: [],
        });
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/essays/recommendations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRecommendations(response.data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.response?.data?.message || 'Failed to fetch recommendations.');
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchUserData();
    fetchRecommendations();
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!userData) {
    return <p className="loading">Loading user data...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Streak Section */}
      <div className="streak">
        <h3 className="section-title">Streak</h3>
        <p>Current Streak: {userData.streak?.current || 0} days</p>
        <p>
          Last Active: {userData.streak?.lastActiveDate
            ? new Date(userData.streak.lastActiveDate).toLocaleDateString()
            : 'No activity yet'}
        </p>
      </div>

      {/* Completed Essays Section */}
      <div className="completed-essays">
        <h3 className="section-title">Completed Essays</h3>
        {userData.completedEssays && userData.completedEssays.length > 0 ? (
          userData.completedEssays.map((entry, index) => (
            <div key={index} className="essay-entry">
              <p>Essay Title: {entry.title}</p>
              <p>Time Spent: {entry.timeSpent > 0 ? `${entry.timeSpent.toFixed(1)} minutes` : 'Not recorded'}</p>
            </div>
          ))
        ) : (
          <p>No completed essays yet.</p>
        )}
      </div>

      {/* Recommendations Section */}
      <div className="recommendations">
        <h3 className="section-title">Recommended Essays</h3>
        {loadingRecommendations ? (
          <p>Loading recommendations...</p>
        ) : recommendations.length > 0 ? (
          <ul>
            {recommendations.map((essay) => (
              <li key={essay._id} className="recommendation-item">
                <strong>{essay.title}</strong> - {essay.topic} ({essay.difficulty})
                <br />
                <a href={`/essays/${essay._id}`} className="start-reading">
                  Start Reading
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available. Try exploring more topics.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
