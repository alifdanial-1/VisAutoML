import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import PsychologyIcon from '@mui/icons-material/Psychology'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import HelpIcon from '@mui/icons-material/Help'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import StarIcon from '@mui/icons-material/Star'
import SchoolIcon from '@mui/icons-material/School'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import QuizIcon from '@mui/icons-material/Quiz'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'
import { 
  Button, 
  Badge, 
  Tooltip, 
  Dialog, 
  DialogContent,
  Paper,
  Typography,
  Box,
  Grid,
  Zoom,
  Grow,
  Fade,
  Slide,
  Chip,
  Tabs,
  Tab,
} from '@mui/material'

const ProgressIndicator = ({ section, tutorialComplete, quizComplete }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      width: 96,
    }}
  >
    <Box
      sx={{
        position: 'relative',
        width: 64,
        height: 64,
        border: '2px solid #E5E7EB',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      aria-label={`Progress Indicator for ${section}`}
    >
      {tutorialComplete && quizComplete ? (
        // Both complete - show single centered check
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#22C55E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Tooltip title="Section Completed">
            <CheckIcon
              sx={{
                color: 'white',
                fontSize: '40px',
              }}
            />
          </Tooltip>
        </Box>
      ) : (
        // Not both complete - show split view
        <>
          {/* Tutorial Half Circle (Left) */}
          <Box
            sx={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              left: 0,
              backgroundColor: tutorialComplete ? '#22C55E' : '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Tooltip title={tutorialComplete ? "Tutorial Completed" : "Tutorial Incomplete"}>
              {tutorialComplete ? (
                <CheckIcon
                  sx={{
                    color: 'white',
                    fontSize: '24px',
                    transform: 'translateX(10%)',
                  }}
                />
              ) : (
                <SchoolIcon
                  sx={{
                    color: '#9CA3AF',
                    fontSize: '20px',
                    transform: 'translateX(10%)',
                  }}
                />
              )}
            </Tooltip>
          </Box>

          {/* Quiz Half Circle (Right) */}
          <Box
            sx={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              right: 0,
              backgroundColor: quizComplete ? '#22C55E' : '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Tooltip title={quizComplete ? "Quiz Completed" : "Quiz Incomplete"}>
              {quizComplete ? (
                <CheckIcon
                  sx={{
                    color: 'white',
                    fontSize: '24px',
                    transform: 'translateX(-10%)',
                  }}
                />
              ) : (
                <QuizIcon
                  sx={{
                    color: '#9CA3AF',
                    fontSize: '20px',
                    transform: 'translateX(-10%)',
                  }}
                />
              )}
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
    <Typography 
      variant="caption" 
      sx={{ 
        fontWeight: 500,
        fontSize: '0.75rem',
        textAlign: 'center',
        maxWidth: '90px',
        lineHeight: 1.2
      }}
    >
      {section}
    </Typography>
  </Box>
)

const EducationalFAB = ({ open, onToggle, onTaskStart, onTaskComplete, onQuizRedo, currentPage }) => {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState("tutorial")
  const [selectedTab, setSelectedTab] = useState(0)
  const dispatch = useDispatch()

  // Get global states
  const tasks = useSelector((state) => state.tasks || [])
  const learningProgress = useSelector((state) => state.learningProgress || [
    { name: "Machine\nLearning", tutorialComplete: false, quizComplete: false },
    { name: "Data\nBasics", tutorialComplete: false, quizComplete: false },
    { name: "Data\nPreprocessing", tutorialComplete: false, quizComplete: false },
    { name: "Model\nTraining", tutorialComplete: false, quizComplete: false },
    { name: "Model\nEvaluation", tutorialComplete: false, quizComplete: false }
  ])
  const { mode } = useSelector((state) => state.model)
  const devMode = mode > 0

  // Handle closing notification
  const handleCloseNotification = (e) => {
    e.stopPropagation()
    setShowNotification(false)
  }

  // Get current section index based on page
  const getCurrentSectionIndex = () => {
    const pageMapping = {
      'home': 0,
      'dataset': 1,
      'review': 2,
      'select': 3,
      'explain': 4
    }
    return pageMapping[currentPage] || 0
  }

  // Get the appropriate tooltipId based on the current page
  const getPageTooltipId = () => {
    const tooltipIdMapping = {
      'home': 2,
      'dataset': 10,
      'review': 15,
      'select': 23,
      'explain': 34
    }
    return tooltipIdMapping[currentPage] || 2
  }

  useEffect(() => {
    const sectionIndex = getCurrentSectionIndex()
    const currentSection = learningProgress[sectionIndex]

    console.log(`[EducationalFAB] Current page: ${currentPage}, Section index: ${sectionIndex}`)
    console.log(`[EducationalFAB] Current section:`, currentSection)
    console.log(`[EducationalFAB] Dev mode:`, devMode)

    // In guide mode, automatically start tutorial/quiz
    if (devMode) {
      console.log(`[EducationalFAB] Guide mode active, checking tutorial/quiz status`)
      if (!currentSection.tutorialComplete) {
        // Automatically start tutorial if not completed
        const taskId = `tutorial-${sectionIndex + 1}`
        console.log(`[EducationalFAB] Auto-starting tutorial with taskId: ${taskId}`)
        handleTaskAction(taskId)
        // Set tooltipId to 100 temporarily during tutorial
        dispatch({ type: "TOGGLE_MODE", payload: 100 })
        console.log(`[EducationalFAB] Set tooltipId to 100 for tutorial`)
      } else if (!currentSection.quizComplete) {
        // Automatically start quiz after tutorial completion
        const taskId = `quiz-${sectionIndex + 1}`
        console.log(`[EducationalFAB] Auto-starting quiz with taskId: ${taskId}`)
        handleTaskAction(taskId)
        // Set tooltipId to 100 temporarily during quiz
        dispatch({ type: "TOGGLE_MODE", payload: 100 })
        console.log(`[EducationalFAB] Set tooltipId to 100 for quiz`)
      } else {
        // If both tutorial and quiz are completed, set tooltipId to the appropriate page value
        console.log(`[EducationalFAB] Both tutorial and quiz completed, setting tooltipId to ${getPageTooltipId()}`)
        dispatch({ type: "TOGGLE_MODE", payload: getPageTooltipId() })
      }
    }

    // Show notifications in normal mode
    if (!devMode) {
      // Show tutorial notification if tutorial not completed
      if (!currentSection.tutorialComplete) {
        setShowNotification(true)
        setNotificationType("tutorial")
      }
      // Show quiz notification if tutorial completed but quiz not completed
      else if (!currentSection.quizComplete) {
        setShowNotification(true)
        setNotificationType("quiz")
      }
      // Hide notification if both are completed
      else {
        setShowNotification(false)
      }
    } else {
      // Hide notifications in guide mode since we auto-start tasks
      setShowNotification(false)
    }
  }, [currentPage, learningProgress, devMode, dispatch])

  // Monitor changes in guide mode
  useEffect(() => {
    // If guide mode is enabled (devMode is true) and both tutorial and quiz are completed
    if (devMode) {
      const sectionIndex = getCurrentSectionIndex()
      const currentSection = learningProgress[sectionIndex]
      
      console.log(`[EducationalFAB] Guide mode effect - Section: ${sectionIndex}, Tutorial: ${currentSection.tutorialComplete}, Quiz: ${currentSection.quizComplete}`)
      
      if (currentSection.tutorialComplete && currentSection.quizComplete) {
        // Set tooltipId to the appropriate page value
        console.log(`[EducationalFAB] Both completed in guide mode, setting tooltipId to ${getPageTooltipId()}`)
        dispatch({ type: "TOGGLE_MODE", payload: getPageTooltipId() })
      }
    }
  }, [devMode, dispatch, learningProgress, currentPage])

  const getNotificationContent = () => {
    const contentMap = {
      'home': {
        tutorial: {
          title: 'Start Your ML Journey',
          description: 'Learn the fundamentals of Machine Learning and AutoML'
        },
        quiz: {
          title: 'Test Your ML Knowledge',
          description: 'Take a quiz on Machine Learning concepts'
        }
      },
      'dataset': {
        tutorial: {
          title: 'Master Data Basics',
          description: 'Learn about data types, formats, and preprocessing'
        },
        quiz: {
          title: 'Data Basics Quiz',
          description: 'Test your understanding of data concepts'
        }
      },
      'review': {
        tutorial: {
          title: 'Data Preprocessing Guide',
          description: 'Learn about data cleaning and feature engineering'
        },
        quiz: {
          title: 'Preprocessing Challenge',
          description: 'Test your data preprocessing knowledge'
        }
      },
      'select': {
        tutorial: {
          title: 'Model Training Guide',
          description: 'Learn about algorithm selection and training'
        },
        quiz: {
          title: 'Training Concepts Quiz',
          description: 'Test your model training knowledge'
        }
      },
      'explain': {
        tutorial: {
          title: 'Model Evaluation Guide',
          description: 'Learn about metrics and model interpretation'
        },
        quiz: {
          title: 'Evaluation Mastery Quiz',
          description: 'Test your model evaluation skills'
        }
      }
    }

    return contentMap[currentPage] || contentMap['home']
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const getPageTasks = () => {
    const taskMapping = {
      'home': 'Machine Learning',
      'dataset': 'Data Basics',
      'review': 'Data Preprocessing',
      'select': 'Model Training',
      'explain': 'Model Evaluation'
    }

    const currentCategory = taskMapping[currentPage] || 'Machine Learning'
    
    const currentTasks = tasks.filter(task => task.category === currentCategory)
    const otherTasks = tasks.filter(task => task.category !== currentCategory)
    
    return { currentTasks, otherTasks }
  }

  const handleTaskAction = (taskId) => {
    console.log(`[EducationalFAB] handleTaskAction called with taskId: ${taskId}`)
    onTaskStart(taskId)
    onToggle(false)
    // Set tooltipId to 100 temporarily during tutorial/quiz
    dispatch({ type: "TOGGLE_MODE", payload: 100 })
    console.log(`[EducationalFAB] Set tooltipId to 100 in handleTaskAction`)
  }

  // Handle task completion
  const handleTaskCompletion = (taskId) => {
    console.log(`[EducationalFAB] handleTaskCompletion called with taskId: ${taskId}`)
    // Call the parent component's onTaskComplete function
    onTaskComplete(taskId)
    
    // After task completion, check if both tutorial and quiz are completed
    const sectionIndex = getCurrentSectionIndex()
    const currentSection = learningProgress[sectionIndex]
    
    console.log(`[EducationalFAB] Task completed - Section: ${sectionIndex}, Tutorial: ${currentSection.tutorialComplete}, Quiz: ${currentSection.quizComplete}`)
    
    // If the completed task was a quiz
    if (taskId.includes('quiz')) {
      console.log(`[EducationalFAB] Quiz task completed`)
      // If both tutorial and quiz are now completed, set tooltipId to the appropriate page value
      if (currentSection.tutorialComplete) {
        console.log(`[EducationalFAB] Both tutorial and quiz now completed, setting tooltipId to ${getPageTooltipId()}`)
        dispatch({ type: "TOGGLE_MODE", payload: getPageTooltipId() })
      }
    }
  }

  const { currentTasks, otherTasks } = getPageTasks()
  const notificationContent = getNotificationContent()

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}>
      <Fade
        in={showNotification}
        timeout={300}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 80,
            right: 0,
            width: 280,
            zIndex: 1301,
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              right: 24,
              width: 16,
              height: 16,
              backgroundColor: '#FFFFFF',
              transform: 'rotate(45deg)',
              zIndex: -1
            }
          }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 2,
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Close button */}
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
              }}
            >
              <Button
                size="small"
                sx={{
                  minWidth: 0,
                  p: 0.5,
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={handleCloseNotification}
                aria-label="Close notification"
              >
                <CloseIcon sx={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }} />
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              {notificationType === "tutorial" ? (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    flexShrink: 0
                  }}
                >
                  <MenuBookIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    flexShrink: 0
                  }}
                >
                  <QuizIcon sx={{ color: '#059669', fontSize: 20 }} />
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: notificationType === "tutorial" ? '#1E40AF' : '#047857',
                    mb: 0.5,
                    fontSize: '0.9rem',
                    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                    letterSpacing: '-0.01em'
                  }}
                >
                  {notificationContent[notificationType].title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#64748B',
                    display: 'block',
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    mb: 1.5
                  }}
                >
                  {notificationContent[notificationType].description}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  onClick={() => {
                    const taskId = notificationType === "tutorial" 
                      ? `tutorial-${Object.keys(getNotificationContent()).indexOf(currentPage) + 1}`
                      : `quiz-${Object.keys(getNotificationContent()).indexOf(currentPage) + 1}`
                    handleTaskAction(taskId)
                    setShowNotification(false)
                    // Set tooltipId to 100 temporarily during tutorial/quiz
                    dispatch({ type: "TOGGLE_MODE", payload: 100 })
                  }}
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 0.5,
                    px: 2,
                    borderRadius: '6px',
                    backgroundColor: notificationType === "tutorial" ? '#2563EB' : '#059669',
                    '&:hover': {
                      backgroundColor: notificationType === "tutorial" ? '#1E40AF' : '#047857',
                    },
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    minHeight: 0,
                    lineHeight: 1.5
                  }}
                >
                  {notificationType === "tutorial" ? 'Start Tutorial' : 'Take Quiz'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>

      <Tooltip 
        title={
          <Box sx={{ 
            p: 1.5,
            width: '100%'
          }}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 700, 
              mb: 0.75,
              color: '#1F2937',
              fontFamily: "'SF Pro Display', sans-serif",
              fontSize: '0.95rem'
            }}>
              ML Learning Hub
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#4B5563',
              fontFamily: "'SF Pro Display', sans-serif",
              fontSize: '0.85rem',
              lineHeight: 1.5
            }}>
              Explore concepts and track your progress!
            </Typography>
          </Box>
        }
        placement="left"
        enterDelay={200}
        leaveDelay={200}
        TransitionComponent={Zoom}
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: '#FFFFFF !important',
              backdropFilter: 'blur(2px)',
              border: '2px solid rgba(2, 2, 2, 0.08) !important',
              borderRadius: '16px !important',
              '& .MuiTooltip-arrow': {
                color: '#FFFFFF !important',
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
                '&::before': {
                  border: '2px solid rgba(31, 41, 55, 0.08) !important'
                }
              }
            }
          }
        }}
        sx={{
          '& .MuiTooltip-tooltip': {
            backgroundColor: '#FFFFFF !important',
            maxWidth: 240,
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(31, 41, 55, 0.08)',
            padding: 0
          },
          '& .MuiTooltip-arrow': {
            color: '#FFFFFF !important',
            '&::before': {
              backgroundColor: '#FFFFFF !important',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(31, 41, 55, 0.08)'
            }
          }
        }}
      >
        <Zoom in={true}>
          <Badge 
            badgeContent={currentTasks.filter(task => !task.completed).length} 
            color="error"
            invisible={currentTasks.every(task => task.completed)}
            sx={{
              '& .MuiBadge-badge': {
                top: 4,
                right: 4,
                border: '2px solid #fff',
                padding: '0 4px',
                minWidth: '20px',
                height: '20px'
              },
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
              '&:active': { transform: 'scale(0.9)' }
            }}
          >
            <Button
              onClick={onToggle}
              variant="contained"
              size="large"
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1E88E5, #1565C0)',
                },
                boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:active': {
                  transform: 'scale(0.95)',
                  boxShadow: '0 4px 8px rgba(33, 150, 243, 0.2)',
                }
              }}
              aria-label="Educational Progress FAB"
            >
              <AutoStoriesIcon sx={{ width: 32, height: 32, color: 'white' }} />
            </Button>
          </Badge>
        </Zoom>
      </Tooltip>

      <Dialog 
        open={open} 
        onClose={() => onToggle(false)} 
        maxWidth={false}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 200 }}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
            margin: 0,
            zIndex: 1400
          },
          '& .MuiDialog-container': {
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          },
          zIndex: '1400 !important'
        }}
      >
        <DialogContent sx={{ p: 0, bgcolor: 'transparent', border: 'none', boxShadow: 'none' }}>
          <Box
            sx={{
              position: 'relative',
              marginBottom: '88px',
              marginRight: '24px',
              width: 400,
            }}
          >
            <Paper 
              sx={{ p: 3, borderRadius: 2, maxHeight: 800, overflow: 'hidden' }}
              elevation={8}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper 
                  sx={{ 
                    background: 'linear-gradient(to right, #4F46E5, #2563EB)',
                    p: 2, 
                    borderRadius: 2
                  }}
                >
                  <Typography 
                    variant="h6" 
                    color="white"
                    fontWeight={700} 
                    gutterBottom
                  >
                    ML Learning Journey
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="rgba(255, 255, 255, 0.9)"
                  >
                    Embark on your AutoML adventure!
                  </Typography>
                </Paper>
                
                <Box
                  sx={{
                    maxHeight: 600,
                    overflow: 'auto',
                    pr: 1,
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2,
                    minHeight: 400,
                  }}>
                    <Box component="section">
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MenuBookIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Your Learning Path
                        </Typography>
                      </Box>

                      <Box sx={{ borderBottom: 0, mb: 2 }}>
                        <Tabs 
                          value={selectedTab} 
                          onChange={handleTabChange}
                          variant="fullWidth"
                          sx={{
                            minHeight: '40px',
                            '& .MuiTab-root': {
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              minHeight: '40px',
                              padding: '8px 16px',
                              color: '#6B7280',
                              transition: 'all 0.3s ease',
                              '&.Mui-selected': {
                                color: '#FFFFFF',
                                fontWeight: 700,
                                backgroundColor: '#2563EB',
                              }
                            },
                            '& .MuiTabs-indicator': {
                              display: 'none', // Remove the underline indicator
                            },
                            backgroundColor: '#F3F4F6',
                            borderRadius: '8px',
                            padding: '4px',
                          }}
                        >
                          <Tab 
                            label="Current" 
                            sx={{
                              borderRadius: '6px',
                              '&:hover': {
                                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                              },
                            }}
                          />
                          <Tab 
                            label="Other"
                            sx={{
                              borderRadius: '6px',
                              '&:hover': {
                                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                              },
                            }}
                          />
                        </Tabs>
                      </Box>
                      
                      {tasks.length > 0 ? (
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 1,
                          height: '196px', // Height to fit exactly 2 task items (88px each) + 20px gap
                          overflow: 'auto',
                          msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
                          scrollbarWidth: 'none', // Hide scrollbar in Firefox
                          '&::-webkit-scrollbar': { // Hide scrollbar in Chrome/Safari
                            display: 'none'
                          },
                          // Add a subtle fade effect at the bottom if content overflows
                          maskImage: 'linear-gradient(to bottom, black calc(100% - 20px), transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 20px), transparent 100%)'
                        }}>
                          {selectedTab === 0 ? (
                            currentTasks.length > 0 ? (
                              currentTasks.map((task) => (
                                <TaskItem
                                  key={task.id}
                                  id={task.id}
                                  icon={task.type === 'tutorial' ? <SchoolIcon color="primary" /> : <QuizIcon color="success" />}
                                  title={task.title}
                                  description={task.description}
                                  onComplete={() => handleTaskCompletion(task.id)}
                                  completed={task.completed}
                                  started={task.started}
                                  onQuizRedo={onQuizRedo}
                                  dispatch={dispatch}
                                  onTaskStart={handleTaskAction}
                                />
                              ))
                            ) : (
                              <Box sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                              }}>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                  No learning tasks for this section
                                </Typography>
                              </Box>
                            )
                          ) : (
                            otherTasks.length > 0 ? (
                              otherTasks.map((task) => (
                                <TaskItem
                                  key={task.id}
                                  id={task.id}
                                  icon={task.type === 'tutorial' ? <SchoolIcon color="primary" /> : <QuizIcon color="success" />}
                                  title={task.title}
                                  description={task.description}
                                  onComplete={() => handleTaskCompletion(task.id)}
                                  completed={task.completed}
                                  started={task.started}
                                  onQuizRedo={onQuizRedo}
                                  dispatch={dispatch}
                                  onTaskStart={handleTaskAction}
                                />
                              ))
                            ) : (
                              <Box sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                              }}>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                  No other learning tasks available
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ 
                          height: '196px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Great job! You've completed all tasks. Check back soon for more.
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box component="section">
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Learning Progress
                        </Typography>
                      </Box>
                      
                      <Box 
                        sx={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          alignItems: 'center',
                        }}
                      >
                        {/* First Row - 3 indicators */}
                        <Box 
                          sx={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2,
                            width: '100%',
                            px: 2,
                          }}
                        >
                          {learningProgress.slice(0, 3).map((section, index) => (
                            <ProgressIndicator
                              key={index}
                              section={section.name}
                              tutorialComplete={section.tutorialComplete}
                              quizComplete={section.quizComplete}
                            />
                          ))}
                        </Box>

                        {/* Second Row - 2 indicators, centered */}
                        <Box 
                          sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            width: '100%',
                            px: 2,
                          }}
                        >
                          {learningProgress.slice(3).map((section, index) => (
                            <ProgressIndicator
                              key={index + 3}
                              section={section.name}
                              tutorialComplete={section.tutorialComplete}
                              quizComplete={section.quizComplete}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

const TaskItem = ({ 
  icon, 
  title, 
  description, 
  onComplete, 
  completed, 
  started, 
  onQuizRedo, 
  dispatch,
  onTaskStart,
  id
}) => (
  <Paper 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      p: 2,
      height: '88px',
      bgcolor: completed ? '#f0f7f0' : '#f5f5f5',
      '&:hover': { bgcolor: completed ? '#e6f3e6' : '#eeeeee' },
      transition: 'background-color 0.3s',
      cursor: completed ? 'default' : 'pointer'
    }}
    role="button"
    tabIndex={0}
    onClick={completed ? undefined : () => onTaskStart(id)}
    onKeyPress={(e) => { if (e.key === 'Enter' && !completed) onTaskStart(id); }}
    aria-label={`Task: ${title}`}
  >
    <Box sx={{ pl: 0.5 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '20px',
        height: '20px',
      }}>
        {icon}
      </Box>
    </Box>
    <Box sx={{ 
      flex: 1, 
      pl: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 0.5
    }}>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 600,
          lineHeight: 1.3,
          fontSize: '0.9rem'
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ 
          lineHeight: 1.3,
          fontSize: '0.8rem'
        }}
      >
        {description}
      </Typography>
    </Box>
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 0.75,
        minWidth: '90px'
      }}
    >
      {completed ? (
        <>
          <Chip 
            label="Completed" 
            size="small" 
            color="success" 
            sx={{ py: 0.5, px: 1 }}
          />
          {(title.includes('Tutorial') || title.includes('Quiz')) && (
            <Button
              size="small"
              sx={{ 
                minWidth: 0,
                p: 0,
                textDecoration: 'underline',
                fontSize: '0.75rem',
                textTransform: 'none',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                width: '100%',
                textAlign: 'center',
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (title.includes('Quiz')) {
                  onQuizRedo();
                  dispatch({ type: "TOGGLE_MODE", payload: 100 });
                } else {
                  onTaskStart(id);
                  dispatch({ type: "TOGGLE_MODE", payload: 100 });
                }
              }}
            >
              {title.includes('Quiz') ? 'Redo Quiz' : 'Open Tutorial'}
            </Button>
          )}
        </>
      ) : started ? (
        <>
          <Chip 
            label="In Progress" 
            size="small" 
            color="primary" 
            sx={{ py: 0.5, px: 1 }}
          />
          {(title.includes('Tutorial') || title.includes('Quiz')) && (
            <Button
              size="small"
              sx={{ 
                minWidth: 0,
                p: 0,
                textDecoration: 'underline',
                fontSize: '0.75rem',
                textTransform: 'none',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                width: '100%',
                textAlign: 'center',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onTaskStart(id);
              }}
            >
              {title.includes('Quiz') ? 'Continue Quiz' : 'Open Tutorial'}
            </Button>
          )}
        </>
      ) : (
        <Button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onTaskStart(id);
          }} 
          size="small" 
          variant="contained" 
          color="primary"
          sx={{ py: 0.75, px: 2, fontSize: '0.8rem' }}
        >
          Start
        </Button>
      )}
    </Box>
  </Paper>
)

const AchievementItem = ({ icon, title, description }) => (
  <Paper 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      p: 1, 
      textAlign: 'center',
      bgcolor: '#fff8e1'
    }}
  >
    <Box sx={{ mb: 0.5 }}>{icon}</Box>
    <Typography variant="body2" fontWeight={500} color="#bf360c">{title}</Typography>
    <Typography variant="caption" color="#e65100">{description}</Typography>
  </Paper>
)

export default EducationalFAB