import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, IconButton, Collapse } from '@mui/material';
import { ArrowForward as ArrowForwardIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import Draggable from 'react-draggable';

// Define the LearningPopup component
const LearningPopup = ({ question, isVisible, onClose, position }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  if (!isVisible) return null; // Don't render if not visible

  return (
    <Card sx={{ 
      position: 'absolute', 
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 370, 
      boxShadow: 3, 
      zIndex: 9999, 
      borderRadius: '12px'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#2563eb', 
        padding: '16px', 
        borderRadius: '4px 4px 0 0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ color: 'white' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Inter, sans-serif' }}>
            {question.section}
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.9, fontFamily: 'Inter, sans-serif' }}>
            Question {question.currentQuestion} of {question.totalQuestions}
          </Typography>
        </div>
        <IconButton 
          onClick={onClose}
          disabled={selectedAnswer === null}
          sx={{ 
            color: 'white',
            opacity: selectedAnswer === null ? 0.5 : 1,
            '&:hover': {
              backgroundColor: selectedAnswer !== null ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </div>

      <CardContent>
        {/* Question */}
        <div style={{ marginBottom: '16px' }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ fontFamily: 'Inter, sans-serif' }}>
            {question.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ fontFamily: 'Inter, sans-serif' }}>
            {question.question}
          </Typography>
        </div>

        {/* Options */}
        <div>
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer;
            const isSelected = selectedAnswer === index;

            return (
              <Button
                key={index}
                variant="outlined"
                fullWidth
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                sx={{
                  marginBottom: '8px',
                  color: isSelected ? 'white' : 'black',
                  backgroundColor: isSelected ? (isCorrect ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)') : 'transparent',
                  borderColor: isSelected ? (isCorrect ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)') : 'rgba(0, 0, 0, 0.2)',
                  textTransform: 'none',
                  justifyContent: 'flex-start',  // Align text to the left
                  textAlign: 'left',              // Ensure text content is left-aligned
                  padding: '8px 8px',           // Add some padding for better spacing
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: isSelected ? (isCorrect ? 'rgba(56, 142, 60, 0.7)' : 'rgba(198, 40, 40, 0.7)') : 'transparent',
                    borderColor: isSelected ? (isCorrect ? 'rgba(56, 142, 60, 0.7)' : 'rgba(198, 40, 40, 0.7)') : 'rgba(0, 0, 0, 0.3)',
                  },
                  fontFamily: 'Inter, sans-serif' // Apply Inter font to Button
                }}
              >
                <Typography 
                  variant="body2" 
                  fontWeight={500} 
                  sx={{ 
                    fontFamily: 'Inter, sans-serif', 
                    color: isSelected ? 'white' : 'black' // Change text color to white if selected
                  }}
                >
                  {option.toLowerCase()
                    .replace(/^(.)/, str => str.toUpperCase())
                    .replace(/\) (.)/, (match, letter) => `) ${letter.toUpperCase()}`)}
                </Typography>
              </Button>
            );
          })}
        </div>

        {/* Explanation Section */}
        {showExplanation && (
          <div style={{ marginTop: '16px' }}>
            {/* Button to view explanation */}
            <div>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setIsExpanded(!isExpanded)}
                endIcon={isExpanded ? <ExpandMoreIcon /> : <ExpandMoreIcon />}
                sx={{ fontFamily: 'Inter, sans-serif' }} // Apply Inter font to Button
              >
                <Typography 
                  variant="body2" 
                  fontWeight="bold" // Make the text bold
                  sx={{ 
                    fontFamily: 'Inter, sans-serif', 
                    textAlign: 'left', // Align text to the left
                    textTransform: 'capitalize' // Capitalize the first letter
                  }}
                >
                  view explanation
                </Typography>
              </Button>
            </div>
            {/* Collapse section for explanation */}
            <div>
              <Collapse in={isExpanded}>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px', fontFamily: 'Inter, sans-serif' }}>
                  {question.explanation}
                </Typography>
              </Collapse>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Set default props for the component
LearningPopup.defaultProps = {
  question: {
    section: "Default Section",
    currentQuestion: 1,
    totalQuestions: 1,
    title: "Default Title",
    question: "Default Question?",
    options: ["a) default option 1", "b) default option 2"],
    correctAnswer: 0,
    explanation: "Default Explanation."
  }
};

export default LearningPopup;