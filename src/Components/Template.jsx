import React, { useState, useEffect } from 'react';
import './template.css';

function Template() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          'https://opentdb.com/api.php?amount=10&type=multiple'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result.results);
        console.log('Fetched data:', result.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      } else {
        handleNext();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (skipped) {
      handleNext();
      setSkipped(false);
    }
  }, [skipped]);

  const handleSkip = () => {
    setSkipped(true);
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(5);
    } else {
      setEnded(true);
    }
  };

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setUserScore((prevScore) => prevScore + 1);
    }
    handleNext();
  };

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  if (ended || currentIndex >= data.length) {
    return (
      <div className="template-container">
        <h2>Template Ended</h2>
        <p>
          Your score: {userScore}/{data.length}
        </p>
      </div>
    );
  }

  const currentData = data[currentIndex];

  return (
    <div className="template-container">
      <h1 className="template-title">Template App</h1>
      <div className="question-container">
        <h2 className="question-title">Question {currentIndex + 1}</h2>
        <p className="question-text">{currentData.question}</p>
        <ul className="answer-list">
          {currentData.incorrect_answers.map((answer, index) => (
            <li key={index}>
              <button
                className="answer-button"
                onClick={() => handleAnswerClick(false)}
              >
                {answer}
              </button>
            </li>
          ))}
          <li>
            <button
              className="answer-button"
              onClick={() => handleAnswerClick(true)}
            >
              {currentData.correct_answer}
            </button>
          </li>
        </ul>
        <p className="timer">Time left: {timeLeft} seconds</p>
        <button className="skip-button" onClick={handleSkip}>
          Skip Question
        </button>
      </div>
    </div>
  );
}

export default Template;
