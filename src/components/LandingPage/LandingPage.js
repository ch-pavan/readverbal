import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="header">
        <div className="logo">ReadVerbal</div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#aeon-essays">Why Aeon Essays?</a>
          <a href="/login" className="btn-secondary">Log In</a>
          <a href="/register" className="btn-primary">Sign Up</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1> Read Smarter, Think Faster</h1>
          <p>Master reading comprehension with timed practice, adaptive difficulty, and daily streaks to stay consistent.</p>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why ReadVerbal?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Adaptive Content</h3>
            <p>Topics tailored to your interests and gradually increasing difficulty.</p>
          </div>
          <div className="feature-card">
            <h3>Streak Motivation</h3>
            <p>Track your streaks and stay consistent with visual motivators.</p>
          </div>
          <div className="feature-card">
            <h3>Analyze Patterns</h3>
            <p>Understand your reading speed, accuracy, and comprehension trends.</p>
          </div>
          <div className="feature-card">
            <h3>Vocabulary Assistance</h3>
            <p>Hover over complex words for instant definitions and usage examples.</p>
          </div>
        </div>
      </section>

      
      {/* Why Aeon Essays Section */}
      <section id="aeon-essays" className="aeon-essays">
      {/*
        <h2>Why Every CAT Mentor Recommends Aeon Essays</h2>
        <p className="aeon-subtext">
          Reading Aeon essays helps CAT aspirants excel in RCs by building essential skills:
        </p>
        <div className="aeon-benefits-container">
          <div className="aeon-benefit">
            <i className="icon-topic"></i>
            <p>Diverse topics mirror real CAT passage types (e.g., Science, Philosophy).</p>
          </div>
          <div className="aeon-benefit">
            <i className="icon-critical"></i>
            <p>Encourages critical reasoning with nuanced arguments.</p>
          </div>
          <div className="aeon-benefit">
            <i className="icon-vocabulary"></i>
            <p>Expands vocabulary naturally through exposure to complex language.</p>
          </div>
        </div>
        */}
      </section>
      

    </div>
  );
};

export default LandingPage;
