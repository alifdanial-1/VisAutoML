import { useEffect, useState } from "react";
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '12px !important',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  backgroundColor: '#ffffff',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `0 0 ${theme.spacing(2)} 0`,
  },
}));

const NavigationBar = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  borderTop: '1px solid #e2e8f0',
  padding: '12px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 1,
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#3498db',
  borderRadius: '8px',
  padding: '10px 20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  minWidth: '140px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f8fafc',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transform: 'translateY(-1px)',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
  },
}));

const ProgressDot = styled(Box)(({ active }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: active ? '#3498db' : '#e2e8f0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: active ? 'none' : 'scale(1.2)',
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  borderRadius: '12px',
  '&.Mui-expanded': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  color: '#2c3e50',
  fontFamily: "'SF Pro Display', sans-serif",
}));

const SectionContent = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  color: '#34495e',
  lineHeight: 1.6,
  fontFamily: "'SF Pro Display', sans-serif",
}));

const images = [
  {
    id: 1,
    buttonName: 'Feature Importance',
    question1: 'What is it?',
    question2: 'How to use it?',
    question3: 'Use the Insights',
    answer1: "Objective: This 'Feature/Column Importance' graph is designed to show the average impact of each feature (or column) in the dataset on the model's prediction outcome.",
    answer2: "Interpreting SHAP Values: The length of each bar represents the mean absolute SHAP value, which is a way to quantify the strength and direction (positive or negative) of a column's effect on the prediction.",
    answer3: "Model Explanation: These insights can also be used to explain to stakeholders why the model makes certain predictions and what factors it considers most important.",
    title: "Feature Importance: Identify which columns are most influential in the model's prediction",
    image: '/img/gif12.gif'
  },
  {
    id: 2,
    question1: 'What is it?',
    question2: 'How to use it?',
    question3: 'Use the Insights',
    answer1: "Metrics Overview: The table lists different performance metrics that are used to evaluate the quality of the model. Each metric provides a different insight into how well the model is performing.",
    answer11: "Predicted vs Actual: This graph visually assesses how well the model's predictions match the actual data. Each point represents an observation: the x-axis shows the true value, and the y-axis shows the predicted value.",
    answer13: "Confusion Matrix: A confusion matrix is a table that is often used to describe the performance of a classification model on a set of test data for which the true values are known. It allows you to visualize the performance of an algorithm",
    answer2: "Interpreting Metrics: Depending on the problem type (Regression/Classification), it is more favourable to have lower values on the Regression metrics as they indicate errors while it is more favourable to get higher values on the Classification metrics",
    answer22: "Interpreting Predicted vs Actual: Examine how closely the points follow the diagonal line, which represents perfect prediction. Points that are far from the line represent larger errors in prediction. A tighter cluster of points around the line indicates a model that predicts more accurately.",
    answer23: "Interpreting Confusion Matrix: The key takeaway is that higher numbers on the diagonal are good (more correct predictions), and lower numbers off the diagonal are better (fewer incorrect predictions). The metrics in the table quantify the model's performance and can guide you in making decisions to improve the model or to understand its limitations.",
    answer3: "Model Explanation: These insights can also be used to explain to stakeholders the accuracy of the models and display the overall quality of the model.",
    
    buttonName: 'Regression / Classification Stats',
    title: "Stats: Assess how well the model's predictions match the actual data.",
    image: '/img/gif11.gif'
  },
  {
    id: 3,
    question1: 'What is it?',
    question2: 'How to use it?',
    question3: 'Use the Insights',
    answer1: "Prediction: This section is where you select the individual data point (ID Column) you want to analyze. It's crucial for evaluating the model's predictions on a case-by-case basis.",
    answer11: "Contributions Plot: This section visualizes how much each column contributes to the prediction for the selected ID. Columns that push the prediction higher are shown in green, and those that lower it are in red. This plot is essential for understanding the 'why' behind the model's decision.",
    answer2: "Using Prediction: Choose an (ID Column) from the dataset using the dropdown menu or click Random to select an ID at random. The Observed: indicates the actual outcome, providing a real-world benchmark for the model's prediction.",
    answer22: "Using Contributions Plot: This tool allows you to dissect the prediction and see which columns had the most significant impact, positively or negatively.",
    answer3: "Model Explanation: This section demystifies the model's predictions by breaking them down into understandable parts. It allows for a granular look at the decision-making process, aiding in both trust-building and educational insights into how machine learning models work.",
    
    buttonName: 'Individual Predictions',
    title: "Individual Predictions: Evaluate the model's predictions on a case-by-case basis",
    image: '/img/gif13.gif'
  },
  {
    id: 4,
    question1: 'What is it?',
    question2: 'How to use it?',
    question3: 'Use the Insights',
    answer1: "Prediction: This section is where you select the individual data point (ID Column) you want to analyze. It's crucial for evaluating the model's predictions on a case-by-case basis.",
    answer11: "Feature Input: This section lets you adjust the values of the columns for the selected ID and see how these changes might affect the model's prediction. This can help you understand which columns are most influential and how sensitive the model is to changes in the input data.",
    answer2: "Interpreting Prediction: Choose an (ID Column) from the dataset using the dropdown menu or click Random to select an ID at random. The Observed: indicates the actual outcome, providing a real-world benchmark for the model's prediction.",
    answer22: "Interpreting Contributions Plot: Adjust the column values using the dropdown menus and input fields. As you adjust these values, the 'Prediction' section will update to reflect the new predicted outcome based on the changed inputs.This interactivity allows you to perform what-if analyses to explore hypothetical scenarios.",
    answer3: "Model Explanation: By adjusting input columns, you can simulate what-if scenarios to explore how changes in input data might affect outcomes. This can be a powerful way to understand the decision-making process of the model.",    
    buttonName: 'What if..',
    title: 'What if..: Simulate what-if scenarios to explore how changes in input data might affect outcomes.',
    image: '/img/gif14.gif'
  },
  {
    id: 5,
    question1: 'What is it?',
    question2: 'How to use it?',
    question3: 'Use the Insights',
    answer1: "Shap Summary: provides a summary of the model's decision-making process for a particular column. It combines elements of box plots and density plots to show the distribution of SHAP values. This helps in understanding the overall impact of the column on the model.",
    answer11: "Shap Dependence: allows you to understand the effect of a single column across the whole dataset. It shows how the model's output varies with changes in the column value. This is crucial for recognizing which columns are driving the model's predictions and how they're doing so.",
    answer2: "Using Shap Summary: Read the plot to see the distribution of the SHAP values for different categories within the selected column. The wider sections represent a higher density of data points, meaning that the SHAP value is more common in that range.",
    answer22: "Using Shap Dependence: Select the main column you're interested in from the 'Column:' dropdown. Observe the spread of data points to see how changes in the column value affect the SHAP value.",
    answer3: "Model Explanation: These insights can be used to explain to stakeholders which columns are driving the model's predictions and how each value is understood by the model",
    
    buttonName: 'Feature Dependence',
    title: "Feature Dependence: Learn which columns are driving the model's predictions and how.",
    image: '/img/giftest.gif'
  }
];

const LoadingDialog = ({ open, setOpen, response }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState('section1');

  useEffect(() => {
    if (response) {      
      const isActive = response.finishing;
      console.log('Is Active:', isActive);
    }
  }, [response]);

  const handleClose = () => {
    setOpen(false);
    setCurrentImage(0);
    setExpandedSection('section1');
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
    setExpandedSection('section1');
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    setExpandedSection('section1');
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#f8fafc',
          borderRadius: '16px',
          minHeight: '80vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      {/* Top Navigation Bar */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid #e2e8f0',
      }}>
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          {/* Progress Bar */}
          <Box sx={{ 
            flex: 1,
            height: 8,
            bgcolor: '#e2e8f0',
            borderRadius: 4,
            position: 'relative',
            mr: 2,
          }}>
            <Box sx={{ 
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${(currentImage / (images.length - 1)) * 100}%`,
              bgcolor: '#3498db',
              borderRadius: 4,
              transition: 'width 0.3s ease',
            }} />
          </Box>
          
          {/* Progress Dots */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            {images.map((image, index) => (
              <Tooltip key={image.id} title={image.buttonName}>
                <ProgressDot 
                  active={index === currentImage}
                  onClick={() => {
                    setCurrentImage(index);
                    setExpandedSection('section1');
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            ml: 2,
            color: '#64748b',
            '&:hover': {
              bgcolor: 'rgba(100, 116, 139, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ 
        p: 4, 
        pb: 2,
        flex: 1,
        overflow: 'auto',
      }}>
        <Box sx={{ display: 'flex', gap: 4, height: '100%' }}>
          {/* Left side - Image */}
          <Box sx={{ flex: '0 0 60%' }}>
            <Box sx={{ 
              position: 'relative',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3,
                  fontFamily: "'SF Pro Display', sans-serif",
                  color: '#2c3e50',
                  fontWeight: 600
                }}
              >
                {images[currentImage].title}
              </Typography>
              <img
                src={images[currentImage].image}
                alt={images[currentImage].title}
                style={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </Box>
          </Box>

          {/* Right side - Content */}
          <Box sx={{ 
            flex: '0 0 40%',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pr: 2,
            }}>
              <StyledAccordion
                expanded={expandedSection === 'section1'}
                onChange={handleAccordionChange('section1')}
              >
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <SectionTitle>What is it?</SectionTitle>
                </StyledAccordionSummary>
                <AccordionDetails>
                  <SectionContent>
                    {images[currentImage].answer1}
                    {images[currentImage].answer11 && (
                      <Box sx={{ mt: 2 }}>{images[currentImage].answer11}</Box>
                    )}
                    {images[currentImage].answer13 && (
                      <Box sx={{ mt: 2 }}>{images[currentImage].answer13}</Box>
                    )}
                  </SectionContent>
                </AccordionDetails>
              </StyledAccordion>

              <StyledAccordion
                expanded={expandedSection === 'section2'}
                onChange={handleAccordionChange('section2')}
              >
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <SectionTitle>How to use it?</SectionTitle>
                </StyledAccordionSummary>
                <AccordionDetails>
                  <SectionContent>
                    {images[currentImage].answer2}
                    {images[currentImage].answer22 && (
                      <Box sx={{ mt: 2 }}>{images[currentImage].answer22}</Box>
                    )}
                    {images[currentImage].answer23 && (
                      <Box sx={{ mt: 2 }}>{images[currentImage].answer23}</Box>
                    )}
                  </SectionContent>
                </AccordionDetails>
              </StyledAccordion>

              <StyledAccordion
                expanded={expandedSection === 'section3'}
                onChange={handleAccordionChange('section3')}
              >
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <SectionTitle>Use the Insights</SectionTitle>
                </StyledAccordionSummary>
                <AccordionDetails>
                  <SectionContent>
                    {images[currentImage].answer3}
                  </SectionContent>
                </AccordionDetails>
              </StyledAccordion>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Fixed Navigation Bar */}
      <NavigationBar>
        <Box sx={{ flex: 1 }}>
          <NavigationButton
            onClick={handlePrev}
            disabled={currentImage === 0}
            startIcon={<NavigateBeforeIcon />}
          >
            Previous
          </NavigationButton>
        </Box>
        <Box sx={{ 
          flex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#64748b',
          fontSize: '0.9rem',
          fontFamily: "'SF Pro Display', sans-serif",
        }}>
          {currentImage + 1} of {images.length}
        </Box>
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <NavigationButton
            onClick={handleNext}
            disabled={currentImage === images.length - 1}
            endIcon={<NavigateNextIcon />}
          >
            Next
          </NavigationButton>
        </Box>
      </NavigationBar>
    </Dialog>
  );
};

export default LoadingDialog;
