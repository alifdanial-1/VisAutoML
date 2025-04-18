import { Box, Grid, Paper, Button, Card, Divider, IconButton, Typography, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import EditDialog from "../common/EditDialog";
import "../../App.css";
import { useNavigate } from 'react-router-dom'; // make sure you've installed react-router-dom
import HelpIcon from '@mui/icons-material/Help';
import LoadingDialog from "./LoadingDialog";
import { withStyles } from "@mui/styles";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import TutorialComponent from "../common/TutorialComponent";
import QuizDialog from "../common/QuizDialog";
import EducationalFAB from "../common/Fab";
import {
  mlTutorialData,
  dataBasicsTutorialData,
  dataPreprocessingTutorialData,
  modelTrainingTutorialData,
  modelEvaluationTutorialData,
  mlQuizQuestions,
  dataBasicsQuizQuestions,
  dataPreprocessingQuizQuestions,
  modelTrainingQuizQuestions,
  modelEvaluationQuizQuestions
} from "../common/LearningContent";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../config/config";
import Cookies from "js-cookie";

// Import images for tutorials
import ml from "../../static/images/Home Page.gif";
import ml2 from "../../static/images/howitwork.gif";
import ml3 from "../../static/images/typeofml.gif";
import sl from "../../static/images/supervisedl.gif";
import cl from "../../static/images/cl.gif";
import rg from "../../static/images/rg.gif";
import im from "../../static/images/Import Page.gif";
import dts from "../../static/images/dataset.gif";

const Body = ({ backDialogOpen, setBackDialogOpen }) => {
  const navigate = useNavigate();
  const [refreshCount, setRefreshCount] = useState(0);
  const { name, type } = useSelector((state) => state.model);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);

  // FAB state management
  const [fabOpen, setFabOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentTutorialData, setCurrentTutorialData] = useState(mlTutorialData);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState(mlQuizQuestions);

  const { id } = useParams();
  const location = useLocation();
  const [dashboardUrl, setDashboardUrl] = useState(location.state?.dashboardUrl || null);

  useEffect(() => {
    if (!dashboardUrl && id) {
      const csrfToken = Cookies.get("csrftoken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
      };
  
      axios
        .post(BACKEND_BASE_URL + `dashboard/${id}/`, {}, config)
        .then(async (res) => {
          const url = res?.data?.url;
  
          if (!url) {
            console.error("No dashboard URL returned");
            return;
          }
  
          let retries = 15;
          let isReady = false;
  
          while (retries > 0) {
            try {
              await axios.get(url);
              isReady = true;
              break;
            } catch (e) {
              await new Promise((res) => setTimeout(res, 1000));
              retries--;
            }
          }
  
          if (isReady) {
            setDashboardUrl(url);
          } else {
            alert("Dashboard failed to load. Please try again later.");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch dashboard URL", err);
        });
    }
  }, [id, dashboardUrl]);
  
  
  const [fabTasks, setFabTasks] = useState([
    {
      id: 'tutorial-1',
      type: 'tutorial',
      title: 'Machine Learning Tutorial',
      description: 'Learn the fundamentals of ML and AutoML',
      completed: false,
      started: false
    },
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Machine Learning Quiz',
      description: 'Test your knowledge of ML concepts',
      completed: false,
      started: false
    },
    {
      id: 'tutorial-2',
      type: 'tutorial',
      title: 'Data Basics Tutorial',
      description: 'Learn about data preprocessing and analysis',
      completed: false,
      started: false
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Data Basics Quiz',
      description: 'Test your knowledge of data concepts',
      completed: false,
      started: false
    },
    {
      id: 'tutorial-3',
      type: 'tutorial',
      title: 'Data Preprocessing Tutorial',
      description: 'Learn about data cleaning and preparation',
      completed: false,
      started: false
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Data Preprocessing Quiz',
      description: 'Test your knowledge of data preprocessing',
      completed: false,
      started: false
    },
    {
      id: 'tutorial-4',
      type: 'tutorial',
      title: 'Model Training Tutorial',
      description: 'Learn about algorithm selection, data splitting, and column mapping',
      completed: false,
      started: false
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Model Training Quiz',
      description: 'Test your knowledge of model training concepts',
      completed: false,
      started: false
    },
    {
      id: 'tutorial-5',
      type: 'tutorial',
      title: 'Model Evaluation Tutorial',
      description: 'Learn about model performance metrics and interpretation',
      category: "Model Evaluation",
      completed: false,
      started: false
    },
    {
      id: 'quiz-5',
      type: 'quiz',
      title: 'Model Evaluation Quiz',
      description: 'Test your knowledge of model evaluation concepts',
      category: "Model Evaluation",
      completed: false,
      started: false
    }
  ]);

  const [learningProgress, setLearningProgress] = useState([
    { 
      name: "Machine\nLearning",
      tutorialComplete: false, 
      quizComplete: false 
    },
    { 
      name: "Data\nBasics",
      tutorialComplete: false, 
      quizComplete: false 
    },
    { 
      name: "Data\nPreprocessing",
      tutorialComplete: false, 
      quizComplete: false 
    },
    { 
      name: "Model\nTraining",
      tutorialComplete: false, 
      quizComplete: false 
    },
    { 
      name: "Model\nEvaluation",
      tutorialComplete: false, 
      quizComplete: false 
    }
  ]);

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#5C5C5C',
      color: '#ffffff',
      minWidth: "450px",
      textAlign: "center",
      fontSize: theme.typography.pxToRem(14),
      border: '1px solid #dadde9',
      borderRadius: '10px',
      padding: '1em',
      fontFamily: "'SF Pro Display', sans-serif",
  
    },
  }));
  
  const CustomTooltip = withStyles({
    tooltip: {
      minWidth: "450px",
      textAlign: "center",
    }
  })(Tooltip);

  const handleBack = () => {
    setBackDialogOpen(true);
  };
  const handleRefresh = () => {
    console.log('Refreshing Box...');
    setLoading(true);
    setRefreshCount(prevCount => prevCount + 1);
  }

  const handleLoad = () => {
    setLoading(false);
  }

  // This function will navigate to the "/review" route when called
  const handleBack1 = () => {
    setBackDialogOpen(true);
  };

  const { mode } = useSelector((state) => state.model);

  const [tooltipId, setTooltipId] = useState(0);

  const dispatch = useDispatch();

  const handleOpen = () => { };

  const handleClose = () => { };

  useEffect(() => {
    setTooltipId(mode);
  }, [mode]);

  const onClick = () => {
    setLoadingOpen(true);
  }

  // FAB event handlers
  const handleFabToggle = () => {
    setFabOpen(!fabOpen);
  };

  const handleTaskStart = (taskId) => {
    dispatch({ type: "START_TASK", payload: taskId });

    // Set tutorial/quiz data based on task ID
    if (taskId.startsWith('tutorial')) {
      setShowTutorial(true);
      switch(taskId) {
        case 'tutorial-1':
          setCurrentTutorialData(mlTutorialData);
          break;
        case 'tutorial-2':
          setCurrentTutorialData(dataBasicsTutorialData);
          break;
        case 'tutorial-3':
          setCurrentTutorialData(dataPreprocessingTutorialData);
          break;
        case 'tutorial-4':
          setCurrentTutorialData(modelTrainingTutorialData);
          break;
        case 'tutorial-5':
          setCurrentTutorialData(modelEvaluationTutorialData);
          break;
      }
    } else if (taskId.startsWith('quiz')) {
      setShowQuiz(true);
      switch(taskId) {
        case 'quiz-1':
          setCurrentQuizQuestions(mlQuizQuestions);
          break;
        case 'quiz-2':
          setCurrentQuizQuestions(dataBasicsQuizQuestions);
          break;
        case 'quiz-3':
          setCurrentQuizQuestions(dataPreprocessingQuizQuestions);
          break;
        case 'quiz-4':
          setCurrentQuizQuestions(modelTrainingQuizQuestions);
          break;
        case 'quiz-5':
          setCurrentQuizQuestions(modelEvaluationQuizQuestions);
          break;
      }
    }
  };

  const handleTaskComplete = (taskId) => {
    dispatch({ type: "COMPLETE_TASK", payload: taskId });
    
    // Get section index from task ID
    const sectionIndex = parseInt(taskId.slice(-1)) - 1;
    
    if (sectionIndex >= 0 && sectionIndex < 5) {
      dispatch({ 
        type: "UPDATE_PROGRESS", 
        payload: {
          sectionIndex,
          type: taskId.includes('tutorial') ? 'tutorial' : 'quiz',
          complete: true
        }
      });
    }
  };

  const handleTutorialComplete = () => {
    const currentTutorialId = currentTutorialData === mlTutorialData ? 'tutorial-1' : 
                            currentTutorialData === dataBasicsTutorialData ? 'tutorial-2' : 
                            currentTutorialData === dataPreprocessingTutorialData ? 'tutorial-3' :
                            currentTutorialData === modelTrainingTutorialData ? 'tutorial-4' :
                            'tutorial-5';
    handleTaskComplete(currentTutorialId);
    setShowTutorial(false);
  };

  const handleQuizComplete = (score) => {
    const currentQuizId = currentQuizQuestions === mlQuizQuestions ? 'quiz-1' : 
                         currentQuizQuestions === dataBasicsQuizQuestions ? 'quiz-2' : 
                         currentQuizQuestions === dataPreprocessingQuizQuestions ? 'quiz-3' :
                         currentQuizQuestions === modelTrainingQuizQuestions ? 'quiz-4' :
                         'quiz-5';
    handleTaskComplete(currentQuizId);
    setShowQuiz(false);
  };

  const handleQuizRedo = () => {
    // Get current quiz ID
    const currentQuizId = currentQuizQuestions === mlQuizQuestions ? 'quiz-1' : 
                         currentQuizQuestions === dataBasicsQuizQuestions ? 'quiz-2' : 
                         currentQuizQuestions === dataPreprocessingQuizQuestions ? 'quiz-3' :
                         currentQuizQuestions === modelTrainingQuizQuestions ? 'quiz-4' :
                         'quiz-5';
    
    // Get section index from quiz ID
    const sectionIndex = parseInt(currentQuizId.slice(-1)) - 1;
    
    dispatch({ 
      type: "UPDATE_PROGRESS",
      payload: {
        sectionIndex,
        type: 'quiz',
        complete: false
      }
    });
    dispatch({ type: "RESET_TASK", payload: currentQuizId });
    setShowQuiz(true);
    // Keep current quiz questions
  };

  return (
    <Grid className="main"
      sx={{
        flex: 1,
        backgroundColor: "#F5F5F5",
        overflowX: "hidden",
        overflowY: "auto",
        padding: "30px",
      }}
    > 
      <Paper sx={{width: "100%", height: "100%", padding: "20px", borderRadius: "20px"}}>
        <Grid container sx={{height: "100%"}}>
          <Grid item xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton 
                onClick={handleBack1}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "1.2rem" },
                    fontWeight: 700,
                    fontFamily: "'SF Pro Display', sans-serif",
                    color: "#1E293B",
                    mb: 0.5
                  }}
                >
                  Predict & Explain
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.95rem", md: ".95rem" },
                    fontWeight: 400,
                    fontFamily: "'SF Pro Display', sans-serif",
                    color: "#64748B"
                  }}
                >
                  Understand how your model makes predictions
                </Typography>
              </Box>
              <IconButton 
                onClick={handleRefresh} 
                title="Refresh ML Explainer"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
            {/* middle Grid */}
            <Grid item display="flex" justifyContent="center" alignItems="center" sx={{mainTop: "30px", marginRight:"5em"}}>            
              <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              fontFamily: "'SF Pro Display', sans-serif",
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}
            // onClick={() => setOpenEdit(true)}
          >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={`${process.env.PUBLIC_URL}/img/${type}.png`} alt={type} />
                <span style={{ marginLeft: "5px" }}>{name}</span>
              </div>
          </Typography>
            {/* help button grid */}
            </Grid>
            <Grid item display="flex" justifyContent="center" alignItems="center" sx={{mainTop: "30px"}}>      
            <CustomTooltip
                open={tooltipId === 34 ? true : false}
                onOpen={handleOpen}
                onClose={handleClose}
                title={
                  <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                    <Typography>Need some help? Click on the Guide button to make sense out of the graphs.</Typography>
                    <Box style={{ display: 'flex', justifyContent: "flex-end" }}>
                      {/* <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(33)}>PREVIOUS</Button> */}
                      <Button variant="contained" onClick={() => dispatch({ type: "TOGGLE_MODE", payload: -1 })}>OKAY</Button>
                    </Box>
                  </Box>
                }
                placement="bottom-start"
                arrow
              >
              <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              fontFamily: "'SF Pro Display', sans-serif",
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}
            onClick={() => onClick()}
          >
              <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    textDecoration: "none",
                    borderRadius: "8px"
                  }}
                >
                  <HelpIcon fontSize="smaller" sx={{ color: "#ffffff", marginRight:"1px" }} />
                  GUIDE
                </Button>
              </div>
          </Typography>
          </CustomTooltip>    
            </Grid>
          </Grid>
          <Grid item xs={12}  
            sx={{
              width: '98%',
              height: '92%',
              position: 'relative'
            }}
          >
            {loading && (
              <Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
            <iframe
            id="iframe-id"
            src={dashboardUrl}
            width="100%"
            height="900px"
            onLoad={handleLoad}
            frameBorder="0"
          ></iframe>

          </Grid>
        </Grid>
      </Paper>
      {/* <EditDialog open={openEdit} setOpen={setOpenEdit} modelName={name} /> */}
      <LoadingDialog
        open={loadingOpen}
        setOpen={setLoadingOpen}
      />
      <TutorialComponent
        tutorialData={currentTutorialData}
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
        conceptName={
          currentTutorialData === mlTutorialData ? "Machine Learning" :
          currentTutorialData === dataBasicsTutorialData ? "Data Basics" :
          currentTutorialData === dataPreprocessingTutorialData ? "Data Preprocessing" :
          currentTutorialData === modelTrainingTutorialData ? "Model Training" :
          "Model Evaluation"
        }
      />
      <QuizDialog
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        questions={currentQuizQuestions}
        onComplete={handleQuizComplete}
        onRedo={handleQuizRedo}
        conceptName={
          currentQuizQuestions === mlQuizQuestions ? "Machine Learning" :
          currentQuizQuestions === dataBasicsQuizQuestions ? "Data Basics" :
          currentQuizQuestions === dataPreprocessingQuizQuestions ? "Data Preprocessing" :
          currentQuizQuestions === modelTrainingQuizQuestions ? "Model Training" :
          "Model Evaluation"
        }
      />
      <EducationalFAB 
        open={fabOpen}
        onToggle={handleFabToggle}
        tasks={fabTasks}
        onTaskStart={handleTaskStart}
        onTaskComplete={handleTaskComplete}
        progress={learningProgress}
        onQuizRedo={handleQuizRedo}
        currentPage="explain"
        sx={{ zIndex: 1300 }}
      />
    </Grid>
  );
};

export default Body;
