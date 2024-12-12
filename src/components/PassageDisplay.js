import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import './PassageDisplay.css';

const PassageDisplay = () => {
  const { essayId } = useParams(); // Get essayId from route params
  const navigate = useNavigate(); // For navigation
  const [passageId, setPassageId] = useState(1); // Default to first passage
  const [passage, setPassage] = useState(null);
  const [totalPassages, setTotalPassages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(''); // To capture user answers
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if the question is submitted
  const [feedback, setFeedback] = useState(''); // Stores feedback (Correct/Wrong)
  const [showQuestion, setShowQuestion] = useState(false); // Controls question visibility
  const [showRecommendedTime, setShowRecommendedTime] = useState(false); // Controls recommended time visibility
  const [isEssayCompleted, setIsEssayCompleted] = useState(false);
  const [nextEssayId, setNextEssayId] = useState(null); // To store the next essay ID


  // Fetch user data (including streak) from backend
  const [userData, setUserData] = useState({
    streak: { current: 0, lastActiveDate: null },
    completedEssays: [],
  });

  // Timer and Deviation
  const [startTime, setStartTime] = useState(null); // Start time of passage
  const [timeElapsed, setTimeElapsed] = useState(0); // Live timer
  const [totalTime, setTotalTime] = useState(0); // Total time for the essay

   // Fetch the user's data for streak, etc.
   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://verbal-backend-0cao.onrender.com/api/users/me', {
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

    fetchUserData();
  }, []);


  // Fetch a passage based on passageId
  const fetchPassage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://verbal-backend-0cao.onrender.com/api/essays/${essayId}/passages/${passageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.data.passage) {
        throw new Error('Passage not found.');
      }
      setPassage(response.data.passage);
      setTotalPassages(response.data.totalPassages);
      setStartTime(Date.now()); // Reset start time for the timer
      setTimeElapsed(0); // Clear elapsed time
      setError(null); // Clear any existing error
    } catch (err) {
      console.error('Error fetching passage:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch passage.');
    } finally {
      setLoading(false);
    }
  };

  // Timer updater for timeElapsed
  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
        setTimeElapsed(elapsed);
      }, 1000); // Update every second

      return () => clearInterval(timer); // Clean up the interval on unmount
    }
  }, [startTime]);

  const calculateTime = () => {
    if (!startTime) return 0; // Avoid calculations if the timer hasn't started
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000 / 60; // Convert milliseconds to minutes
    setTotalTime((prev) => prev + timeTaken); // Add this passage's time to the total time
    setStartTime(null); // Reset start time for the next passage
    return timeTaken; // Return time taken for this passage
  };

  useEffect(() => {
    if (passage) {
      setStartTime(Date.now()); // Reset timer for the new passage
      setTimeElapsed(0); // Clear elapsed time for the new passage
      setIsSubmitted(false); // Reset submission state
      setAnswer(''); // Reset the selected answer
      setFeedback(''); // Clear feedback
    }
  }, [passage]);

  const handleNext = () => {
    if (!showQuestion) {
      // If there are no questions, directly move to the next passage
      if (!passage.questions || passage.questions.length === 0) {
        goToNextPassage();
      } else {
        setShowRecommendedTime(true);
        setShowQuestion(true); // Display the question
        calculateTime(); // Calculate time for the current passage
      }
    } else {
      if (!isSubmitted && passage.questions && passage.questions.length > 0) {
        alert('Please submit your answer before proceeding.');
        return;
      }
      setShowRecommendedTime(false); // Hide recommended time for the next passage
      setShowQuestion(false); // Reset question visibility
      setStartTime(Date.now()); // Reset start time for the timer
      setTimeElapsed(0); // Reset elapsed time
      goToNextPassage(); // Move to the next passage or finish the essay
    }
  };

  // Handle answer submission
  const handleSubmit = () => {
    if (!answer) {
      alert('Please select an answer before submitting.');
      return;
    }

    const correctIndex = passage.questions[0]?.correctIndex; // Safely get the correct index
    const correctAnswer = passage.questions[0]?.options[correctIndex]; // Safely get the correct answer

    if (answer === correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Wrong! The correct answer is: ${correctAnswer}`);
    }
    setIsSubmitted(true);
  };

  const goToNextPassage = async () => {
    try {
      const timeTakenForCurrentPassage = calculateTime();
  
      if (passageId === totalPassages) {
        const totalTimeSpent = totalTime + timeTakenForCurrentPassage;
        console.log(`Total time for essay: ${totalTimeSpent.toFixed(2)} minutes`);
  
        await axios.post(
          'https://verbal-backend-0cao.onrender.com/api/users/mark-completed',
          { essayId, timeSpent: totalTimeSpent },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        const response = await axios.get(
          'https://verbal-backend-0cao.onrender.com/api/essays/recommendations',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        const nextEssay = response.data[0];
        if (nextEssay) {
          setNextEssayId(nextEssay._id);
        }
  
        setIsEssayCompleted(true);
      } else {
        setPassageId((prev) => prev + 1);
        setIsSubmitted(false); // Reset submission state
        setAnswer(''); // Reset answer state
        setFeedback(''); // Clear feedback
        setShowQuestion(false); // Ensure question is hidden initially
        setShowRecommendedTime(false); // Hide recommended time initially
      }
    } catch (error) {
      console.error('Error in goToNextPassage:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (essayId) fetchPassage(); // Only fetch if essayId exists
  }, [essayId, passageId]); // Fetch new passage on ID change

  // Highlight difficult words
  const highlightDifficultWords = (content, difficultWords) => {
    if (!difficultWords || difficultWords.length === 0) {
      return content; // Return content as is if no difficult words
    }
    let updatedContent = content;
    difficultWords.forEach(({ word, definition }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      updatedContent = updatedContent.replace(
        regex,
        `<span class="tooltip" data-tooltip="${definition}">${word}</span>`
      );
    });
    return updatedContent;
  };

  // Calculate progress bar percentage
  const progressPercentage = (passageId / totalPassages) * 100;

  return (
    <div className="page-container">
      {/* Streak Container fetched from the backend */}
      <div className="streak-container">
        🔥 {userData.streak?.current || 0}-day Streak
      </div>
      {/* Dashboard Icon */}
      <div className="dashboard-icon" onClick={() => navigate('/dashboard')}>
        <FaUser />
      </div>

      <div className="passage-container">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isEssayCompleted ? (
          passage && (
            <div>
              {/* Progress Bar */}
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Timer */}
              <div className="timer">
                Time Elapsed: {Math.floor(timeElapsed / 60)}:{timeElapsed % 60} (mins)
                {showRecommendedTime && passage?.recommended_time && (
                  <p className="recommended-time">
                    Recommended Time: {passage.recommended_time} minutes
                  </p>
                )}
              </div>

              {/* Passage Content */}
              <div
                className="passage-content"
                dangerouslySetInnerHTML={{
                  __html: highlightDifficultWords(
                    passage.content,
                    passage.difficultWords || []
                  ),
                }}
              ></div>

              {/* Show "Next" Button to Reveal Question */}
              {(!showQuestion || (passage.questions && passage.questions.length === 0)) && (
              <button
                className="next-button"
                onClick={handleNext}
              >
                {passageId < totalPassages ? 'Next Passage' : 'Finish Essay'}
              </button>
            )}

              {/* Question Section */}
              {showQuestion && passage.questions && passage.questions.length > 0 && (
              <div className="question-section">
                <h3>Question</h3>
                <p>{passage.questions[0].question}</p>
                <div className="options">
                  {passage.questions[0].options.map((option, index) => (
                    <label key={index}>
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={answer === option}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={isSubmitted}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <button
                  className="submit-button"
                  onClick={isSubmitted ? handleNext : handleSubmit}
                >
                  {isSubmitted ? 'Next Passage' : 'Submit Answer'}
                </button>
              </div>
            )}

              {/* Feedback */}
              {feedback && (
                <p
                  className={`feedback ${
                    feedback === 'Correct!' ? 'correct' : 'wrong'
                  }`}
                >
                  {feedback}
                </p>
              )}
            </div>
          )
        ) : (
          <div className="completion-message">
            <h2>Essay Completed!</h2>
            <p>Your total time: {totalTime.toFixed(2)} minutes.</p>
            {nextEssayId ? (
              <button
                className="proceed-button"
                onClick={() => (window.location.href = `/essays/${nextEssayId}/`)}
              >
                Proceed to Next Essay
              </button>
            ) : (
              <button
                className="dashboard-button"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassageDisplay;
