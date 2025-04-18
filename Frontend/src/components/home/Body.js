import { Box, Grid, Button, Card, Divider, Typography, Paper, Tooltip as muiTooltip } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from "@mui/icons-material/Add";
import { withStyles } from "@mui/styles";
import NewModelDialog from "./NewModelDialog";
import RegressDialog from "./RegressDialog";
import ClassDialog from "./ClassDialog";
import VideoDialog from "./VideoDialog";
import DeleteDialog from "./DeleteDialog";
import newModel from "../../static/images/newModel.png";
import forecast from "../../static/images/forecast.png";
import onlinevideo from "../../static/images/online-video.png";
import classifier from "../../static/images/open-door.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "./Table";
import TutorialDialog from "./TutorialDialog";
import Avatar from '@mui/material/Avatar';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import Chip from '@mui/material/Chip';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import "../../App.css";
import { BACKEND_BASE_URL } from "../../config/config.js";
import axios from "axios";
import Cookies from "js-cookie";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import WelcomeDialog from "./Welcome.js";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useLocation, useNavigate } from 'react-router-dom';
import TutorialComponent from '../common/TutorialComponent';
import ml from "../../static/images/Home Page.gif";
import ml2 from "../../static/images/howitwork.gif";
import ml3 from "../../static/images/typeofml.gif";
import sl from "../../static/images/supervisedl.gif";
import cl from "../../static/images/cl.gif";
import rg from "../../static/images/rg.gif";
import EducationalFAB from '../common/Fab';
import QuizDialog from '../common/QuizDialog';
import { Fade } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Import tutorial and quiz data
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
  modelEvaluationQuizQuestions,
  easyModeTutorialData
} from '../common/LearningContent';

const CustomTooltip = withStyles({
  tooltip: {
    minWidth: "450px",
    textAlign: "center",
  }
})(muiTooltip);

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const category = {
  Classification: [
    {
      name: "Logistic Regression",
      value: "LogisticRegression"
    },
    {
      name: "Random Forest Classifier",
      value: "RandomForestClassifier"
    },
    {
      name: "Gradient Boosting Classifier",
      value: "GradientBoostingClassifier"
    },
    {
      name: "Decision Tree Classifier",
      value: "DecisionTreeClassifier"
    },
    {
      name: "XGB Classifier",
      value: "XGBClassifier"
    }
  ],
  Regression: [
    {
      name: "Random Forest Regressor",
      value: "RandomForestRegressor"
    },
    {
      name: "Gradient Boosting Regressor",
      value: "GradientBoostingRegressor"
    },
    {
      name: "Extra Trees Regressor",
      value: "ExtraTreesRegressor"
    },
  ]
}


const Body = () => {
  const [newModelOpen, setNewModelOpen] = useState(false);
  const [tooltipId, setTooltipId] = useState(-1);
  const [regressOpen, setRegressOpen] = useState(false);
  const [classifyOpen, setclassOpen] = useState(false);
  const [tutorialOpen, setTutorial] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [clasPercent, setClasPercent] = useState(7);
  const [regPercent, setRegPercent] = useState(93);

  const [rows, setPosts] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [class1, setClass1] = useState('');
  const [class2, setClass2] = useState('');

  const { mode } = useSelector((state) => state.model);

  const dispatch = useDispatch();
  const csrfToken = Cookies.get("csrftoken");
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showEasyModeTutorial, setShowEasyModeTutorial] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentTutorialData, setCurrentTutorialData] = useState(mlTutorialData);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState(mlQuizQuestions);

  // Filter menu states
  const [chartFilterAnchorEl, setChartFilterAnchorEl] = useState(null);
  const [tableFilterAnchorEl, setTableFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [dashboardUrl, setDashboardUrl] = useState(null);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": csrfToken,
    },
  };

  const [fabOpen, setFabOpen] = useState(false);
  
  // Get tasks and progress from Redux instead of local state
  const tasks = useSelector((state) => state.tasks);
  const learningProgress = useSelector((state) => state.learningProgress);
  const [algorithmStats, setAlgorithmStats] = useState({});
  const [trendData, setTrendData] = useState({});

  const [showNotification, setShowNotification] = useState({
    tutorial: true,
    quiz: false
  });

  const handleFabToggle = () => {
    setFabOpen(!fabOpen);
  };

  const handleTaskStart = (taskId) => {
    dispatch({ type: "START_TASK", payload: taskId });

    // Set tutorial/quiz data based on task ID
    if (taskId.startsWith('tutorial')) {
      setTutorial(true);
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
    setTutorial(false);
  };

  const handleTutorialClose = () => {
    setShowEasyModeTutorial(false);
  };

  // Reset tasks and progress on page load
  useEffect(() => {
    dispatch({ type: "RESET_TASK", payload: 'tutorial-1' });
    dispatch({ type: "RESET_TASK", payload: 'quiz-1' });
    
    dispatch({ 
      type: "UPDATE_PROGRESS", 
      payload: {
        sectionIndex: 0,
        type: 'tutorial',
        complete: false
      }
    });
    dispatch({ 
      type: "UPDATE_PROGRESS", 
      payload: {
        sectionIndex: 0,
        type: 'quiz',
        complete: false
      }
    });
  }, []);

  useEffect(() => {
    // Check if user came from landing page
    const params = new URLSearchParams(location.search);
    const fromLanding = params.get('from') === 'landing';
    if (fromLanding) {
        setShowWelcome(true);
    }
}, [location]);

  const handleOpen = () => { };

  const handleClose = () => { };

  const onOpenTutorial = (title, url) => {
    setVideoTitle(title);
    setVideoUrl(url);
    // setVideoDialogOpen(true);
  };

  const handleChange1 = (e) => {
    setClass1(e.target.value);
    if (e.target.value) {
      setChartData(rows.filter(one => one.model_type === e.target.value));
    }
    else {
      setChartData(rows);
    }
    setClass2('');
  };
  const handleChange2 = (e) => {
    setClass2(e.target.value);
    if (e.target.value) {
      setChartData(rows.filter(one => one.model_type === class1 && one.algorithm_name === e.target.value));
    }
    else {
      setChartData(rows.filter(one => one.model_type === class1));
    }
  };

  useEffect(() => {
    axios
      .get(BACKEND_BASE_URL + `table/`, config)
      .then((res) => {
        setPosts(res.data);
        if (class1) {
          if (class2) {
            setChartData(res.data.filter(one => one.model_type === class1 && one.algorithm_name === class2));
          } else {
            setChartData(res.data.filter(one => one.model_type === class1));
          }
        } else {
          setChartData(res.data);
        }
        calcClaspercent(res.data);
        calcRegpercent(res.data);
        dispatch({ type: "GET_REVIEW_SUCCESS", payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setTooltipId(mode);
  }, [mode]);

  useEffect(() => {
    if (tooltipId === 2 || tooltipId === 10) dispatch({ type: "TOGGLE_MODE", payload: tooltipId });
  }, [tooltipId])

  useEffect(() => {
    if (class1) {
      if (class2) {
        setChartData(rows.filter(one => one.model_type === class1 && one.algorithm_name === class2));
      } else {
        setChartData(rows.filter(one => one.model_type === class1));
      }
    } else {
      setChartData(rows);
    }
  }, [rows, class1, class2])

  const calcAvgmark = () => {
    if (rows.length === 0) return "0";
    let sum = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].overall_score === null) {
        continue;
      } else {
        sum += rows[i].overall_score / 1;
      }
    }
    var avg = sum / rows.length;
    return avg.toFixed(0);
  }

  const getRecentalgorithm = () => {
    if (rows.length === 0) return "No models yet";
    let nameset = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].algorithm_name === "") {
        continue;
      } else {
        nameset.push(formatAlgorithmName(rows[i].algorithm_name));
      }
    }
    return nameset[0] || "No models yet";
  }

  const formatAlgorithmName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  }

  const calcClaspercent = (data) => {
    let clas = 0;
    let cnt = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].model_type === "Classification") {
        cnt++;
      }
    }
    clas = (cnt / data.length) * 100;
    // return clas.toFixed(0);
    setClasPercent(parseInt(clas));
  }

  const calcRegpercent = (data) => {
    let reg = 0;
    let cnt = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].model_type === "Regression") {
        cnt++;
      }
    }
    reg = (cnt / data.length) * 100;
    // return reg.toFixed(0);
    setRegPercent(parseInt(reg));
  }

  const getMaxValue = () => {
    let max = 0;
    for (let i = 0; i < chartData.length; i++) {
      if (chartData[i]?.overall_score === null || chartData[i]?.overall_score === "0") {
        continue;
      } else {
        if (max < chartData[i]?.overall_score / 1) {
          // console.log(chartData[i].overall_score);
          max = chartData[i]?.overall_score / 1;
        }
      }
    }
    return max;
  }

  const options = {
    responsive: true,
    displayLabel: false,
    scales: {
      xAxes: {
        display: false,
        gridLines: {
          display: false,
          zerolineColor: "transparent"
        }
      },
      yAxes: {
        max: 100,
        display: false,
        gridLines: {
          display: false,
          zerolineColor: "transparent"
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        position: 'average',
        displayColors: false,
        callbacks: {
          title: () => '',
          label: () => { return '' },
          afterLabel: (context) => {
            const label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              return `${context.label}\nOverall Score: ${context.parsed.y}%`;
            }
            // return label;
          },
          labelTextColor: function () {
            return '#344455'
          }
        },
        backgroundColor: 'white',
        titleFont:{size:12, fontFamily: "'SF Pro Display', sans-serif"},
        bodyFont:{size:11.5, fontFamily: "'SF Pro Display', sans-serif"},
      }
    },
    elements: {
      bar: {
        borderRadius: 5
      }
    },
    maintainAspectRatio: false
  };

  const data = {
    labels: chartData.map(one => `Model Name: ${one.model_name}\nModel Type: ${one.model_type}\nAlgorithm: ${one.algorithm_name}`),
    datasets: [{
      data: chartData.map(one => one.overall_score),
      backgroundColor: chartData.map(one => one.overall_score / 1 === getMaxValue() ? "#EAA349" : "#1A97F5")
    }]
  }

  const cdata = {
    datasets: [{
      data: [regPercent, clasPercent],
      backgroundColor: [
        "#1A97F5",
        "#EAA349"
      ],
      borderWidth: 0,
      hoverOffset: 1,
      rotation: 135,
      cutout: "75%"
    }]
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

  useEffect(() => {
    // Reset notifications on page refresh
    setShowNotification({
      tutorial: true,
      quiz: false
    });
  }, []);

  const handleDismissNotification = (type) => {
    setShowNotification(prev => ({
      ...prev,
      [type]: false
    }));
  };

  const handleChartFilterClick = (event) => {
    setChartFilterAnchorEl(event.currentTarget);
  };

  const handleChartFilterClose = () => {
    setChartFilterAnchorEl(null);
  };

  const handleTableFilterClick = (event) => {
    setTableFilterAnchorEl(event.currentTarget);
  };

  const handleTableFilterClose = () => {
    setTableFilterAnchorEl(null);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    handleTableFilterClose();
  };

  useEffect(() => {
    // Calculate algorithm statistics from rows data
    if (rows && rows.length > 0) {
      const stats = {};
      const trends = {};
      
      rows.forEach(row => {
        if (!row.algorithm_name) return;
        
        const algoName = row.algorithm_name;
        const score = parseFloat(row.overall_score || 0);
        const modelType = row.model_type === 'RG' ? 'regression' : 'classification';
        
        if (!stats[algoName]) {
          stats[algoName] = {
            name: algoName,
            totalScore: score,
            modelCount: 1,
            scores: [score],
            type: modelType
          };
        } else {
          stats[algoName].totalScore += score;
          stats[algoName].modelCount += 1;
          stats[algoName].scores.push(score);
        }
      });

      // Calculate average scores and trends
      Object.keys(stats).forEach(algoName => {
        const algo = stats[algoName];
        algo.avgScore = (algo.totalScore / algo.modelCount).toFixed(1);
        
        // Calculate trend (comparing recent scores to overall average)
        const recentScores = algo.scores.slice(-Math.min(3, algo.scores.length));
        const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        const trend = ((recentAvg - algo.avgScore) / algo.avgScore * 100).toFixed(1);
        trends[algoName] = parseFloat(trend);
      });

      setAlgorithmStats(stats);
      setTrendData(trends);
    }
  }, [rows]);

  const getTopAlgorithms = () => {
    if (!algorithmStats) return [];

    return Object.values(algorithmStats)
      .sort((a, b) => parseFloat(b.avgScore) - parseFloat(a.avgScore))
      .map(algo => ({
        name: algo.name,
        modelCount: algo.modelCount,
        score: algo.avgScore,
        trend: trendData[algo.name] || 0
      }));
  };

  return (
    <Grid container className="main"
      sx={{
        display: "flex",
        backgroundColor: "#F5F5F5",
        overflowX: "hidden",
        overflowY: "hidden",
        padding: "20px",
        position: "relative",
        '@media (max-width: 990px)': {
          width: '990px',
          maxWidth: '990px',
          margin: '0 auto'
        }
      }}
    >
      {/* Notifications Container */}
      {/* <Box 
        sx={{ 
          position: 'fixed', 
          bottom: 90, 
          right: 24, 
          zIndex: 1200,
          width: 320
        }}
      >
        {/* Tutorial Notification */}
        {/* <Fade
          in={showNotification.tutorial}
          timeout={300}
        >
          <Paper 
            elevation={4} 
            sx={{ 
              p: 2.5,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.08)',
              position: 'relative',
              display: showNotification.tutorial ? 'block' : 'none'
            }}
          >
            <IconButton 
              size="small" 
              onClick={() => handleDismissNotification('tutorial')}
              sx={{ 
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#9CA3AF',
                padding: '4px',
                '&:hover': { 
                  color: '#4B5563',
                  bgcolor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#E3F2FD', 
                  width: 40, 
                  height: 40 
                }}
              >
                <MenuBookIcon sx={{ color: '#1A97F5' }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#1F2937',
                    mb: 0.5,
                    fontFamily: "'SF Pro Display', sans-serif"
                  }}
                >
                  New Tutorial Available
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6B7280',
                    fontSize: '0.85rem',
                    fontFamily: "'SF Pro Display', sans-serif"
                  }}
                >
                  Learn about feature engineering in AutoML
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                onClick={() => {
                  handleTaskStart('tutorial-1');
                  handleDismissNotification('tutorial');
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: "'SF Pro Display', sans-serif",
                  color: '#1A97F5',
                  border: '1px solid #1A97F5',
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    bgcolor: '#F0F9FF',
                    borderColor: '#1A97F5'
                  }
                }}
              >
                Start Tutorial
              </Button>
            </Box>
          </Paper>
        </Fade>

        {/* Quiz Notification */}
        {/* <Fade
          in={showNotification.quiz && !showNotification.tutorial}
          timeout={300}
        >
          <Paper 
            elevation={4} 
            sx={{ 
              p: 2.5,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.08)',
              position: 'relative',
              display: showNotification.quiz && !showNotification.tutorial ? 'block' : 'none'
            }}
          >
            <IconButton 
              size="small" 
              onClick={() => handleDismissNotification('quiz')}
              sx={{ 
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#9CA3AF',
                padding: '4px',
                '&:hover': { 
                  color: '#4B5563',
                  bgcolor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#ECFDF5', 
                  width: 40, 
                  height: 40 
                }}
              >
                <QuizIcon sx={{ color: '#059669' }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#1F2937',
                    mb: 0.5,
                    fontFamily: "'SF Pro Display', sans-serif"
                  }}
                >
                  Take a Quick Quiz
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6B7280',
                    fontSize: '0.85rem',
                    fontFamily: "'SF Pro Display', sans-serif"
                  }}
                >
                  Test your knowledge on ML concepts
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                onClick={() => {
                  handleQuizRedo();
                  handleDismissNotification('quiz');
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: "'SF Pro Display', sans-serif",
                  color: '#059669',
                  border: '1px solid #059669',
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    bgcolor: '#F0FDF4',
                    borderColor: '#059669'
                  }
                }}
              >
                Start Quiz
              </Button>
            </Box>
          </Paper>
        </Fade>  */}
      {/* </Box> */}
      {/* <Grid item xs={12} sx={{ width: "100%", height: "35px", padding: "0px 10px 0px 20px", fontWeight: "900",
            fontFamily: "'SF Pro Display', sans-serif", }}> */}
        {/* <Typography
          sx={{
            fontSize: "1.4rem",
            fontWeight: "bolder",            
          }}
        >
          Home
        </Typography> */}
        {/* <Typography
          sx={{    
            fontSize: ".9rem",
            fontWeight: "500",
            color: "black",
            fontFamily: "'SF Pro Display', sans-serif",

          }}
        >
          Dashboard
        </Typography> */}
      {/* </Grid> */}
      <Grid item xs={12} sx={{ width: "100%", height: "220px", marginTop: "0px" }}>
        <Grid container sx={{ width: "100%", height: "100%" }}>
          <Grid item xs={6} md={6} lg={6.17} xl={6.34} sx={{ width: "100%", height: "100%", padding: "10px" }}>
            <Paper sx={{ width: "100%", height: "100%", backgroundColor: "#344455", borderRadius: "20px", padding: "20px" }}>
              <Grid container sx={{ width: "100%", height: "100%" }}>
                <Grid item xs={12} sx={{ width: "100%", height: "25%" }}>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={8}>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.9em", sm: "1em", md: "1.1em" },
                          fontWeight: "bold",
                          fontFamily: "'SF Pro Display', sans-serif",
                          color: "white"
                        }}
                      >
                        Model Performance
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: { xs: "0.7em", sm: "0.75em", md: "0.8em" },
                          fontWeight: "500",
                          color: "white"
                        }}
                      >
                        Regression vs Classification
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        onClick={handleChartFilterClick}
                        sx={{ 
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        <FilterListIcon />
                      </IconButton>
                      <Popover
                        open={Boolean(chartFilterAnchorEl)}
                        anchorEl={chartFilterAnchorEl}
                        onClose={handleChartFilterClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            minWidth: '200px'
                          }
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Typography
                            sx={{
                              fontFamily: "'SF Pro Display', sans-serif",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              mb: 2
                            }}
                          >
                            Filter Options
                          </Typography>
                          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontFamily: "'SF Pro Display', sans-serif" }}>Type</InputLabel>
                            <Select
                              value={class1}
                              onChange={handleChange1}
                              label="Type"
                              sx={{ fontFamily: "'SF Pro Display', sans-serif" }}
                            >
                              <MenuItem value="" sx={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                                <em>All</em>
                              </MenuItem>
                              <MenuItem value="Regression" sx={{ fontFamily: "'SF Pro Display', sans-serif" }}>Regression</MenuItem>
                              <MenuItem value="Classification" sx={{ fontFamily: "'SF Pro Display', sans-serif" }}>Classification</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontFamily: "'SF Pro Display', sans-serif" }}>Algorithm</InputLabel>
                            <Select
                              value={class2}
                              onChange={handleChange2}
                              label="Algorithm"
                              disabled={!class1}
                              sx={{ fontFamily: "'SF Pro Display', sans-serif" }}
                            >
                              <MenuItem value="" sx={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                                <em>All</em>
                              </MenuItem>
                              {class1 && category[class1].map(one => (
                                <MenuItem key={one.value} value={one.value} sx={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                                  {one.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Popover>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ width: "100%", height: "70%", marginTop: "3%" }}>
                  {rows.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'white',
                        opacity: 0.7
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: '1.1rem'
                        }}
                      >
                        No data available
                      </Typography>
                    </Box>
                  ) : (
                    <Bar options={options} data={data} width={"100%"} height={"100%"} />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <CustomTooltip
                open={tooltipId === 3 ? true : false}
                onOpen={handleOpen}
                onClose={handleClose}
                title={
                  <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                    <Typography>Scroll through the historical performance of the top performing algorithms.</Typography>
                    <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(2)}>PREVIOUS</Button>
                      <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(4)}>NEXT</Button>
                    </Box>
                  </Box>
                }
                placement="bottom-start"
                arrow
              >
          <Grid item xs={3} md={3} lg={3.08} xl={3.16} sx={{ width: "100%", height: "100%", backgroundColor: "#F5F5F5", padding: "10px" }}>
            <Paper sx={{ width: "100%", height: "100%", backgroundColor: "#344455", borderRadius: "20px", padding: "20px" }}>
              <Grid container sx={{ width: "100%", height: "100%" }}>
                <Grid item xs={12} sx={{ width: "100%", height: "25%" }}>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      fontFamily: "'SF Pro Display', sans-serif",
                      color: "white"
                    }}
                  >
                    Algorithm Performance
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'SF Pro Display', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      color: "white"
                    }}
                  >
                    Top Performing Algorithms
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ 
                  width: "100%", 
                  height: "75%", 
                  overflow: "auto",
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  pt: 1.5
                }}>
                  {rows.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'white',
                        opacity: 0.7
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: '1.1rem'
                        }}
                      >
                        No algorithms to display
                      </Typography>
                    </Box>
                  ) : (
                    getTopAlgorithms().map((algo, index) => (
                      <Box
                        key={algo.name}
                        sx={{
                          p: 1.2,
                          mb: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.2,
                          height: '52px'
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            fontFamily: "'SF Pro Display', sans-serif"
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: { lg: '0.8rem', md: '0.7rem', xs: '0.7rem' },
                              lineHeight: { lg: '1.2rem', md: '1.2rem', xs: '1rem' },
                              fontWeight: '500',
                              color: 'white',
                              fontFamily: "'SF Pro Display', sans-serif",
                              mb: 0.2
                            }}
                          >
                            {formatAlgorithmName(algo.name)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontFamily: "'SF Pro Display', sans-serif",
                                display: { lg: 'block', md: 'none', xs: 'none' }
                              }}
                            >
                              {algo.modelCount} models
                            </Typography>
                            <Box
                              sx={{
                                display: { lg: 'flex', md: 'none', xs: 'none' },
                                alignItems: 'center',
                                gap: 0.5,
                                color: algo.trend > 0 ? '#4CAF50' : '#f44336'
                              }}
                            >
                              {algo.trend > 0 ? (
                                <TrendingUpIcon sx={{ fontSize: '0.9rem' }} />
                              ) : (
                                <TrendingDownIcon sx={{ fontSize: '0.9rem' }} />
                              )}
                              <Typography
                                sx={{
                                  fontSize: '0.7rem',
                                  fontFamily: "'SF Pro Display', sans-serif",
                                  color: 'inherit'
                                }}
                              >
                                {Math.abs(algo.trend)}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            sx={{
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: 'white',
                              fontFamily: "'SF Pro Display', sans-serif"
                            }}
                          >
                            {algo.score}%
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          </CustomTooltip>
          <Grid item xs={3} md={3} lg={2.75} xl={2.5} sx={{ width: "100%", height: "100%", padding: "10px" }}>
            <Paper sx={{ width: "100%", height: "100%", backgroundColor: "#344455", borderRadius: "20px", padding: "20px" }}>
              <Grid container sx={{ width: "100%", height: "100%" }}>
                <Grid item xs={12} sx={{ width: "100%", height: "25%" }}>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      fontFamily: "'SF Pro Display', sans-serif",
                      color: "white"
                    }}
                  >
                    Model Types
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'SF Pro Display', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      color: "white"
                    }}
                  >
                    Classification vs Regression
                  </Typography>
                </Grid>
                <Grid item width="100%" height="90%" display="flex" alignItems="center" justifyContent="space-between" paddingBottom="10px">
                  {rows.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'white',
                        opacity: 0.7
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: '1.1rem'
                        }}
                      >
                        No model types to display
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Grid item xs={5} width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" position="relative">
                        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Doughnut data={cdata} options={{
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                backgroundColor: 'white',
                                titleColor: '#344455',
                                bodyColor: '#344455',
                                bodyFont: {
                                  family: "'SF Pro Display', sans-serif",
                                  size: 14
                                },
                                padding: 12,
                                boxPadding: 8,
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: 1,
                                boxWidth: 8,
                                boxHeight: 8,
                                usePointStyle: true,
                                callbacks: {
                                  label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${value}%`;
                                  }
                                }
                              }
                            },
                            cutout: '75%',
                            rotation: 135
                          }} />
                          <Box sx={{
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography sx={{
                              color: 'white',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              fontFamily: "'SF Pro Display', sans-serif",
                              display: { lg: 'block', md: 'none', xs: 'none' }
                            }}>
                              Total
                            </Typography>
                            <Typography sx={{
                              color: 'white',
                              fontSize: '1.5rem',
                              fontWeight: '700',
                              fontFamily: "'SF Pro Display', sans-serif",
                            }}>
                              {rows.length}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={7} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Box
                          width="fit-content"
                          display="flex"
                          flexDirection="column"
                          gap={{ xl: "1.5em", lg: "1.2em", md: ".5em" }}
                        >
                          <Box 
                            width="fit-content"
                            display="flex"
                            flexDirection="row"
                            sx={{alignItems: 'center'}}
                          >
                            <Box                        
                              sx={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: "#EAA349",
                                borderRadius: '50%',
                                marginRight: { xl: "12px", lg: "10px", md: "8px" },
                              }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{
                                  fontFamily: "'SF Pro Display', sans-serif",
                                  fontSize: { xl: "1rem", lg: "0.95rem", md: "0.75rem", xs: "0.75rem" },
                                  fontWeight: "600",
                                  color: "white",
                                }}
                              >
                                Classification
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "'SF Pro Display', sans-serif",
                                  fontSize: { xl: "0.9rem", lg: "0.85rem", md: "0.7rem", xs: "0.7rem" },
                                  fontWeight: "500",
                                  color: "rgba(255,255,255,0.7)",
                                }}
                              >
                                {clasPercent}% of models
                              </Typography>
                            </Box>
                          </Box>
                          <Box 
                            width="fit-content"
                            display="flex"
                            flexDirection="row"
                            sx={{alignItems: 'center'}}
                          >
                            <Box                        
                              sx={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: "#1A97F5",
                                borderRadius: '50%',
                                marginRight: { xl: "12px", lg: "10px", md: "8px" },
                              }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{
                                  fontFamily: "'SF Pro Display', sans-serif",
                                  fontSize: { xl: "1rem", lg: "0.95rem", md: "0.75rem", xs: "0.75rem" },
                                  fontWeight: "600",
                                  color: "white",
                                }}
                              >
                                Regression
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: "'SF Pro Display', sans-serif",
                                  fontSize: { xl: "0.9rem", lg: "0.85rem", md: "0.7rem", xs: "0.7rem" },
                                  fontWeight: "500",
                                  color: "rgba(255,255,255,0.7)",
                                }}
                              >
                                {regPercent}% of models
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid >
      <Grid item xs={9} md={9} lg={9.25} xl={9.5} sx={{ width: "100%", height: "740px", backgroundColor: "#F5F5F5" }}>
        <Grid container sx={{ width: "100%", height: "100%" }}>
          <Grid item xs={12} sx={{ width: "100%", height: "150px" }}>
            <Grid container sx={{ width: "100%", height: "100%" }}>
              <Grid item xs={4} sx={{ height: "100%", padding: "10px"}}>
                <Paper sx={{ width: "100%", height: "100%", padding: "20px", backgroundColor: "#1A97F5", borderRadius: "20px" }}>
                  <Grid container sx={{ width: "100%", height: "100%", alignItems: "center", }}>
                    <Grid item xs={12} sx={{ width: "100%", height: "20%" }}>
                      <Grid container>
                        <Grid item xs={10}>
                          <Typography
                            sx={{
                              fontFamily: "'SF Pro Display', sans-serif",
                              fontSize: ".9rem",
                              fontWeight: "500",
                              color: "white",
                            }}
                          >
                            Models Created
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              width: 35,
                              height: 35
                            }}
                          >
                            <ModelTrainingIcon sx={{ color: 'white', fontSize: '1.3rem' }} />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%", height: "60%" }}>
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: { lg: "2.5em", md: "1.9em", xs: "1.9em" },
                          fontWeight: "700",
                          color: "white",
                        }}
                      >
                        {rows.length}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%", height: "20%" }}>
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: "0.7rem",
                          fontWeight: "500",
                          color: "white",
                        }}
                      >
                        All completed & saved models
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={4} sx={{ height: "100%", padding: "10px" }}>
                <Paper sx={{ width: "100%", height: "100%", padding: "20px", borderRadius: "20px" }}>
                  <Grid container sx={{ width: "100%", height: "100%", alignItems: "center", }}>
                    <Grid item xs={12} sx={{ width: "100%", height: "20%" }}>
                      <Grid container>
                        <Grid item xs={10}>
                          <Typography
                            sx={{
                              fontFamily: "'SF Pro Display', sans-serif",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                            }}
                          >
                            Model Average Score
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: '#E3F2FD',
                              width: 35,
                              height: 35
                            }}
                          >
                            <ScoreboardIcon sx={{ color: '#1A97F5', fontSize: '1.3rem' }} />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%", height: "60%" }}>
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: { lg: "2.5em", md: "1.9em", xs: "1.9em" },
                          fontWeight: "700"
                        }}
                      >
                        {calcAvgmark()}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%", height: "20%" }}>
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}
                      >
                        Average score for all models
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={4} sx={{ height: "100%", padding: "10px" }}>
                <Paper sx={{ width: "100%", height: "100%", padding: "20px", borderRadius: "20px" }}>
                  <Grid container sx={{ width: "100%", height: "100%" , alignItems: "center", }}>
                    <Grid item xs={12} sx={{ width: "100%", height: "40%" }}>
                      <Grid container>
                        <Grid item xs={10}>
                          <Typography
                            sx={{
                              fontFamily: "'SF Pro Display', sans-serif",
                              fontSize: "0.8rem",
                              fontWeight: "600"
                            }}
                          >
                            Recently Used Algorithm
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: '#FFF4DE',
                              width: 35,
                              height: 35
                            }}
                          >
                            <PsychologyIcon sx={{ color: '#EAA349', fontSize: '1.3rem' }} />
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%", height: "40%" }}>
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: { lg: "1.0em", md: "1.0em", xs: "1.0em" },
                          lineHeight: { lg: "1.1em", md: "1.1em", xs: ".9em" },
                          fontWeight: "700",
                        }}
                      >
                        {getRecentalgorithm()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%", height: "20%" }}>
                      <Typography
                        sx={{
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}
                      >
                        Algorithm used in recent model
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ width: "100%", height: "590px", padding: "10px" }}>
            <Paper sx={{ width: "100%", height: "100%", padding: "20px", borderRadius: "20px" }}>
              <Grid container>
                <Grid item xs={12} sx={{ padding: "0 5px" }}>
                  <Grid container>
                    <Grid item xs={3} sx={{ textAlign: "left" }}>
                      <Typography
                        sx={{
                          fontSize: { xs: "1.2em", sm: "1.3em", md: "1.2em" },
                          marginTop: "5px",
                          fontFamily: "'SF Pro Display', sans-serif",
                          fontWeight: "bolder",
                        }}
                      >
                        Models
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    </Grid>
                    <Grid item xs={3} sx={{ 
                      textAlign: "right",
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1
                    }}>
                      <IconButton
                        onClick={handleTableFilterClick}
                        sx={{ 
                          color: '#344455',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        <FilterListIcon />
                      </IconButton>
                      <Popover
                        open={Boolean(tableFilterAnchorEl)}
                        anchorEl={tableFilterAnchorEl}
                        onClose={handleTableFilterClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            minWidth: '200px'
                          }
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Typography
                            sx={{
                              fontFamily: "'SF Pro Display', sans-serif",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              mb: 2
                            }}
                          >
                            Sort By
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {[
                              { label: 'Model Name', value: 'model_name' },
                              { label: 'Model Type', value: 'model_type' },
                              { label: 'Algorithm', value: 'algorithm_name' },
                              { label: 'Score', value: 'overall_score' }
                            ].map((option) => (
                              <Button
                                key={option.value}
                                onClick={() => handleSortChange(option.value)}
                                sx={{
                                  justifyContent: 'flex-start',
                                  color: sortBy === option.value ? 'primary.main' : 'text.primary',
                                  fontFamily: "'SF Pro Display', sans-serif",
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                  }
                                }}
                                startIcon={
                                  sortBy === option.value && (
                                    <Typography component="span" sx={{ fontSize: '1.2rem' }}>
                                      {sortOrder === 'asc' ? '↑' : '↓'}
                                    </Typography>
                                  )
                                }
                              >
                                {option.label}
                              </Button>
                            ))}
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                              setSortBy('');
                              setSortOrder('asc');
                              handleTableFilterClose();
                            }}
                            sx={{
                              fontFamily: "'SF Pro Display', sans-serif",
                              textTransform: 'none',
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                              color: 'text.secondary',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                borderColor: 'rgba(0, 0, 0, 0.24)'
                              }
                            }}
                          >
                            Reset Sorting
                          </Button>
                        </Box>
                      </Popover>
                      <CustomTooltip
                        open={tooltipId === 5 ? true : false}
                        onOpen={handleOpen}
                        onClose={handleClose}
                        title={
                          <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                            <Typography>Click on the New Model button to begin developing a
                              machine learning model.</Typography>
                            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(4)}>PREVIOUS</Button>
                              <Button variant="contained" onClick={() => setTooltipId(6)}>OKAY</Button>
                            </Box>
                          </Box>
                        }
                        placement="left"
                        arrow
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          margin="dense"
                          size="medium"
                          sx={{ 
                            borderRadius: "12px", 
                            fontFamily: "'SF Pro Display', sans-serif",
                            fontSize: { xs: "0.8rem", sm: "0.8rem", md: "0.8rem" }
                          }}
                          onClick={() => setNewModelOpen(true)}
                        >
                          New Model
                        </Button>
                      </CustomTooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <CustomTooltip
                  open={tooltipId === 4 ? true : false}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  title={
                    <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                      <Typography>Your model repository! Access, view, and manage your
                        models from this list.</Typography>
                      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(3)}>PREVIOUS</Button>
                        <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(5)}>NEXT</Button>
                      </Box>
                    </Box>
                  }
                  placement="top"
                  arrow
                >
                  <Grid item xs={12} sx={{ marginTop: "10px", padding: "5px" }}>
                    {rows.length === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '400px',
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          p: 4,
                          textAlign: 'center'
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: '#E3F2FD',
                            mb: 2
                          }}
                        >
                          <ModelTrainingIcon sx={{ fontSize: 40, color: '#1A97F5' }} />
                        </Avatar>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "'SF Pro Display', sans-serif",
                            fontWeight: 600,
                            color: '#344455',
                            mb: 1
                          }}
                        >
                          No Models Yet
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "'SF Pro Display', sans-serif",
                            color: '#6B7280',
                            mb: 3,
                            maxWidth: '400px'
                          }}
                        >
                          Get started by creating your first machine learning model. Click the "New Model" button to begin.
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => setNewModelOpen(true)}
                          sx={{
                            borderRadius: "12px",
                            fontFamily: "'SF Pro Display', sans-serif",
                            textTransform: 'none',
                            px: 4
                          }}
                        >
                          Create Your First Model
                        </Button>
                      </Box>
                    ) : (
                      <TableComponent 
                        rows={rows} 
                        setPosts={setPosts} 
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        rowsPerPage={{ lg: 4, md: 4 }}
                        setDashboardUrl={setDashboardUrl}
                        dashboardUrl={dashboardUrl}
                      />
                    )}
                  </Grid>
                </CustomTooltip>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid >
      <Grid item xs={3} md={3} lg={2.75} xl={2.5} sx={{ width: "100%", height: "740px", backgroundColor: "#F5F5F5" }}>
        <CustomTooltip
          open={tooltipId === 30 ? true : false}
          onOpen={handleOpen}
          onClose={handleClose}
          title={
            <Box padding="10px" display="flex" flexDirection="column" gap="10px">
              <Typography>New to ML? These guides provide step-by-step
                introductions to the world of AutoML.</Typography>
              <Box style={{ textAlign: "end" }}>
                <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(3)}>PREVIOUS</Button>
                <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(3)}>NEXT</Button>
              </Box>
            </Box>
          }
          placement="bottom-start"
          arrow
        >
          <Grid container sx={{ width: "100%", height: "100%" }}>
            <Grid item xs={12} sx={{ width: "100%", height: "33.3%", padding: "10px" }}>
              <Paper sx={{ width: "100%", height: "100%", padding: "20px", borderRadius: "20px" }}>
                <Grid container sx={{ width: "100%", height: "100%" }}>
                  <Grid item xs={12} sx={{ width: "100%", height: "15%" }}>
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: "500"
                      }}
                    >
                      Guides and Tutorials
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: { lg: "30%", md: "15%" } }}>
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: { lg: "1.1em", md: "0.9em" },
                        fontWeight: "700"
                      }}
                    >
                      Video Tutorial: VisAutoML
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "10%" }} >
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: "500"
                      }}
                    >
                      Topics Covered:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "25%" }}>
                    <Box
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: "500"
                      }}
                    >
                      <Chip label="ML Pipeline" sx={{ fontFamily: "'SF Pro Display', sans-serif",borderRadius: "4px" }} /> <Chip label="AutoML" sx={{ fontFamily: "'SF Pro Display', sans-serif",borderRadius: "4px" }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "20%", textAlign: "center" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      margin="dense"
                      size="medium"
                      sx={{ borderRadius: "5px", fontFamily: "'SF Pro Display', sans-serif" }}
                      component="a"
                      href="https://app.gitbook.com/o/zdPfAuEYtpcuOflHlZr8/s/6YN5g2XG7tUO55uaWKUE/" // Replace with your desired URL
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Play Video
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} sx={{ width: "100%", height: "33.4%", padding: "10px" }}>
              <Paper sx={{ width: "100%", height: "100%", padding: "20px", borderRadius: "20px" }}>
                <Grid container sx={{ width: "100%", height: "100%" }}>
                <Grid item xs={12} sx={{ width: "100%", height: { lg: "15%", md: "15%" } }}>
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: "500"
                      }}
                    >
                      Guides and Tutorials
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "30%" }}>
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: { lg: "1.1em", md: "0.9em" },
                        fontWeight: "700"
                      }}
                    >
                      How to Understand Model Evaluation?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "10%" }}>
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: "500"
                      }}
                    >
                      Topics Covered:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "25%" }}>
                    <Box
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: "500"
                      }}
                    >
                      <Chip label="Shap" sx={{ fontFamily: "'SF Pro Display', sans-serif",borderRadius: "4px" }} /> <Chip label="ML Metrics" sx={{ fontFamily: "'SF Pro Display', sans-serif",borderRadius: "4px" }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "20%", textAlign: "center" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="inherit"
                      margin="dense"
                      size="medium"
                      sx={{ borderRadius: "5px", fontFamily: "'SF Pro Display', sans-serif" }}
                      component="a"
                      href="https://app.gitbook.com/o/zdPfAuEYtpcuOflHlZr8/s/6YN5g2XG7tUO55uaWKUE/beginner-tips/how-to-evaluate-your-model" // Replace with your desired URL
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sx={{ width: "100%", height: "33.3%", padding: "10px" }}>
              <Paper sx={{ width: "100%", height: "100%", padding: "20px", borderRadius: "20px" }}>
                <Grid container sx={{ width: "100%", height: "100%" }}>
                <Grid item xs={12} sx={{ width: "100%", height: { lg: "15%", md: "15%" } }}>
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: "500"
                      }}
                    >
                      Guides and Tutorials
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "30%" }}>
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: { lg: "1.1em", md: "0.9em" },
                        fontWeight: "700"
                      }}
                    >
                      How to Optimize Model Performance?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "10%" }}>
                    <Typography
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: "500"
                      }}
                    >
                      Topics Covered:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "25%" }}>
                    <Box
                      sx={{
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: "500"
                      }}
                    >
                      <Chip label="Quality" sx={{ fontFamily: "'SF Pro Display', sans-serif",borderRadius: "4px" }}/> <Chip label="Preprocessing" sx={{ fontFamily: "'SF Pro Display', sans-serif",borderRadius: "4px" }}/>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%", height: "20%", textAlign: "center" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="inherit"
                      margin="dense"
                      size="medium"
                      sx={{ borderRadius: "5px", fontFamily: "'SF Pro Display', sans-serif" }}
                      component="a"
                      href="https://app.gitbook.com/o/zdPfAuEYtpcuOflHlZr8/s/6YN5g2XG7tUO55uaWKUE/beginner-tips/how-to-optimize-model-performance" // Replace with your desired URL
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </CustomTooltip>
      </Grid>

      <NewModelDialog
        open={newModelOpen}
        setOpen={setNewModelOpen}
        name={modelName}
        setName={setModelName}
        type={modelType}
        setType={setModelType}
        tooltipId={tooltipId}
        setTooltipId={setTooltipId}
      />
      <RegressDialog
        open={regressOpen}
        setOpen={setRegressOpen}
      />
      <ClassDialog
        open={classifyOpen}
        setOpen={setclassOpen}
      />
      {/* <TutorialDialog
        open={tutorialOpen}
        setOpen={setTutorial}
      /> */}
      {/* <VideoDialog
        open={videoDialogOpen}
        setOpen={setVideoDialogOpen}
        title={videoTitle}
        url={videoUrl}
      /> */}
      <DeleteDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />
      <WelcomeDialog open={tooltipId === -3 && showWelcome} setOpen={setTooltipId}/>
      <TutorialComponent
        tutorialData={currentTutorialData}
        isVisible={tutorialOpen}
        onClose={() => setTutorial(false)}
        onComplete={handleTutorialComplete}
        conceptName={
          currentTutorialData === mlTutorialData ? "Machine Learning" :
          currentTutorialData === dataBasicsTutorialData ? "Data Basics" :
          currentTutorialData === dataPreprocessingTutorialData ? "Data Preprocessing" :
          currentTutorialData === modelTrainingTutorialData ? "Model Training" :
          "Model Evaluation"
        }
      />
      <EducationalFAB 
        open={fabOpen}
        onToggle={handleFabToggle}
        onTaskStart={handleTaskStart}
        onTaskComplete={handleTaskComplete}
        onQuizRedo={handleQuizRedo}
        currentPage="home"
        sx={{ zIndex: 1300 }}
      />
      <QuizDialog
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        questions={currentQuizQuestions}
        onComplete={handleQuizComplete}
        onRedo={handleQuizRedo}
        conceptName="Machine Learning"
      />
    </Grid >
  );
};

export default Body;