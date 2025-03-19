import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  IconButton,
  Typography,
  Button,
  Box,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircleOutline as CorrectIcon,
  HighlightOff as WrongIcon
} from '@mui/icons-material';

const QuizDialog = ({ 
  open, 
  onClose, 
  questions, 
  onComplete,
  onRedo,
  conceptName = "Machine Learning"
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isComplete, setIsComplete] = useState(false);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowExplanation(false);
    setScore(0);
    setAnswers(Array(questions.length).fill(null));
    setIsComplete(false);
    if (onRedo) {
      onRedo();
    }
  };

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNext = () => {
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    // Update score if correct
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }

    // Show explanation
    setShowExplanation(true);
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleFinish = () => {
    onComplete(score);
    onClose();
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!open) return null;

  if (isComplete) {
    return (
      <Dialog 
        open={open} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            width: '90%',
            maxWidth: '500px',
            '& .MuiDialogTitle-root': {
              fontFamily: "'SF Pro Display', sans-serif",
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              pb: 2
            }
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'SF Pro Display', sans-serif",
                fontWeight: 700,
                fontSize: '1.4rem',
                background: 'linear-gradient(45deg, #1A97F5, #4F46E5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Quiz Complete!
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                fontWeight: 800,
                fontSize: '2.5rem',
                color: score >= questions.length * 0.7 ? '#22C55E' : '#EF4444',
                mb: 2
              }}
            >
              {score}/{questions.length}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                fontWeight: 600,
                fontSize: '1.1rem',
                color: score >= questions.length * 0.7 ? '#15803D' : '#B91C1C',
                mb: 1
              }}
            >
              {score >= questions.length * 0.7 ? "Excellent Work! 🎉" : "Keep Learning! 💪"}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                fontSize: '0.95rem',
                maxWidth: '400px',
                margin: '0 auto',
                mt: 1,
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              {score >= questions.length * 0.7 
                ? "You've demonstrated a strong understanding of the concepts. Great job on completing the quiz!" 
                : "Don't worry! Learning takes time. Review the concepts and try again to improve your score."}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={resetQuiz}
                sx={{
                  fontFamily: "'SF Pro Display', sans-serif",
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.95rem'
                }}
              >
                Redo Quiz
              </Button>
              <Button
                variant="contained"
                onClick={handleFinish}
                sx={{
                  fontFamily: "'SF Pro Display', sans-serif",
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.95rem',
                  background: 'linear-gradient(45deg, #1A97F5, #4F46E5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1884D9, #4238C2)'
                  }
                }}
              >
                Finish
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          width: '90%',
          maxWidth: '500px',
          '& .MuiDialogTitle-root': {
            fontFamily: "'SF Pro Display', sans-serif",
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            pb: 2
          }
        }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'SF Pro Display', sans-serif",
              fontWeight: 700,
              fontSize: '1.4rem',
              background: 'linear-gradient(45deg, #1A97F5, #4F46E5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {conceptName} Quiz
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              mb: 2,
              backgroundColor: 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(45deg, #1A97F5, #4F46E5)'
              }
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{
              fontFamily: "'SF Pro Display', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'text.secondary'
            }}
          >
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: "'SF Pro Display', sans-serif",
            fontWeight: 700,
            fontSize: '1.2rem',
            mb: 3,
            lineHeight: 1.4,
            color: '#1F2937'
          }}
        >
          {questions[currentQuestion].question}
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%', my: 1 }}>
          <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
            {questions[currentQuestion].options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={
                  <Radio 
                    sx={{
                      '&.Mui-checked': {
                        color: showExplanation 
                          ? option === questions[currentQuestion].correctAnswer 
                            ? '#22C55E'
                            : '#EF4444'
                          : '#4F46E5'
                      }
                    }}
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      fontFamily: "'SF Pro Display', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 500
                    }}
                  >
                    {option}
                  </Typography>
                }
                disabled={showExplanation}
                sx={{
                  backgroundColor: showExplanation 
                    ? option === questions[currentQuestion].correctAnswer 
                      ? 'rgba(34, 197, 94, 0.08)'
                      : option === selectedAnswer 
                        ? 'rgba(239, 68, 68, 0.08)'
                        : 'transparent'
                    : 'transparent',
                  borderRadius: 2,
                  mx: 0,
                  px: 2,
                  py: 1,
                  mb: 1.5,
                  transition: 'all 0.2s',
                  border: '1px solid',
                  borderColor: showExplanation
                    ? option === questions[currentQuestion].correctAnswer 
                      ? 'rgba(34, 197, 94, 0.2)'
                      : option === selectedAnswer 
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'transparent'
                    : 'rgba(0,0,0,0.08)',
                  '&:hover': {
                    backgroundColor: showExplanation 
                      ? option === questions[currentQuestion].correctAnswer 
                        ? 'rgba(34, 197, 94, 0.12)'
                        : option === selectedAnswer 
                          ? 'rgba(239, 68, 68, 0.12)'
                          : 'transparent'
                      : 'rgba(79, 70, 229, 0.04)'
                  }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {showExplanation && (
          <Box 
            sx={{ 
              mt: 3, 
              mb: 3,
              backgroundColor: selectedAnswer === questions[currentQuestion].correctAnswer 
                ? 'rgba(34, 197, 94, 0.08)'
                : 'rgba(239, 68, 68, 0.08)',
              borderRadius: 2,
              p: 2.5
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                <>
                  <CorrectIcon sx={{ color: '#22C55E', fontSize: '1.5rem' }} />
                  <Typography 
                    sx={{ 
                      fontFamily: "'SF Pro Display', sans-serif",
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#15803D'
                    }}
                  >
                    Correct!
                  </Typography>
                </>
              ) : (
                <>
                  <WrongIcon sx={{ color: '#EF4444', fontSize: '1.5rem' }} />
                  <Typography 
                    sx={{ 
                      fontFamily: "'SF Pro Display', sans-serif",
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#B91C1C'
                    }}
                  >
                    Incorrect
                  </Typography>
                </>
              )}
            </Stack>
            <Typography 
              sx={{ 
                fontFamily: "'SF Pro Display', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: selectedAnswer === questions[currentQuestion].correctAnswer 
                  ? '#166534'
                  : '#991B1B'
              }}
            >
              {questions[currentQuestion].explanation}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          {!showExplanation ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedAnswer}
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1,
                borderRadius: 2,
                fontSize: '0.95rem',
                background: 'linear-gradient(45deg, #1A97F5, #4F46E5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1884D9, #4238C2)'
                },
                '&.Mui-disabled': {
                  background: '#E5E7EB'
                }
              }}
            >
              Check Answer
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleContinue}
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1,
                borderRadius: 2,
                fontSize: '0.95rem',
                background: 'linear-gradient(45deg, #1A97F5, #4F46E5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1884D9, #4238C2)'
                }
              }}
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default QuizDialog;