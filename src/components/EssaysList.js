import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './EssaysList.css'; // Optional for styling

const EssaysList = () => {
  const [essays, setEssays] = useState([]);
  const [filteredEssays, setFilteredEssays] = useState([]);
  const [categories, setCategories] = useState(['All', 'Philosophy', 'Science', 'Psychology', 'Society', 'Culture']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEssays = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://verbal-backend-0cao.onrender.com/api/essays', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEssays(response.data);
        setFilteredEssays(response.data); // Initialize filtered essays
        setError(null);
      } catch (err) {
        console.error('Error fetching essays:', err);
        setError(err.response?.data?.message || 'Failed to fetch essays. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEssays();
  }, []);

  // Filter essays based on category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const filtered = category === 'All' ? essays : essays.filter((essay) => essay.tags.includes(category));
    setFilteredEssays(filtered);
  };

  // Search essays by title
  const handleSearch = (term) => {
    setSearchTerm(term);
    const searched = essays.filter((essay) =>
      essay.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEssays(searched);
  };

  return (
    <div className="essays-list-container">
      <h2>Available Essays</h2>

      {/* Search and Filter Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search essays..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Error and Loading State */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading essays...</p>}

      {/* Essays List */}
      <div className="essays-grid">
        {filteredEssays.map((essay) => (
          <div key={essay._id} className="essay-card">
            <h3>{essay.title}</h3>
            <p><strong>Author:</strong> {essay.author}</p>
            <p><strong>Category:</strong> {essay.tags.join(', ')}</p>
            <p><strong>Difficulty:</strong> {essay.difficulty}</p>
            <Link to={`/essays/${essay._id}`} className="read-more-link">Read Now</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EssaysList;
