const initialState = [
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
];

const learningProgressReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      return state.map((section, index) => {
        if (index === action.payload.sectionIndex) {
          return {
            ...section,
            [action.payload.type === 'tutorial' ? 'tutorialComplete' : 'quizComplete']: action.payload.complete
          };
        }
        return section;
      });

    case 'RESET_ALL_PROGRESS':
      return state.map(section => ({
        ...section,
        tutorialComplete: false,
        quizComplete: false
      }));

    default:
      return state;
  }
};

export default learningProgressReducer; 