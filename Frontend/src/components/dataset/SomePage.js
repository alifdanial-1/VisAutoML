import React from 'react';
import LearningPopup from '@/components/common/LearningPopup';

const SomePage = () => {
  // Sample question data for this page
  const questionData = {
    section: "Preprocessing",
    currentQuestion: 1,
    totalQuestions: 3,
    title: "Understanding Missing Values",
    question: "The 'Age' column has some missing values. Why might dropping all rows with missing ages be problematic for our prediction?",
    options: [
      "A) We might lose too much valuable data",
      "B) Missing ages could be random and unimportant",
      "C) Age doesn't affect survival chances",
      "D) It's better to always remove incomplete data"
    ],
    correctAnswer: 0,
    explanation: "Dropping all rows with missing ages could significantly reduce our dataset size and potentially introduce bias if the missing values aren't random."
  };

  return (
    <div>
      <h1>Some Page</h1>
      {/* Use the LearningPopup component and pass the question data as props */}
      <LearningPopup question={questionData} />
    </div>
  );
};

export default SomePage;