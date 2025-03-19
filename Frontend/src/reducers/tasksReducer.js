// Initial state with all tasks for each section
const initialState = [
  // Machine Learning tasks
  {
    id: 'tutorial-1',
    type: 'tutorial',
    title: 'Machine Learning Tutorial',
    description: 'Learn the fundamentals of ML and AutoML',
    category: 'Machine Learning',
    completed: false,
    started: false
  },
  {
    id: 'quiz-1',
    type: 'quiz',
    title: 'Machine Learning Quiz',
    description: 'Test your knowledge of ML concepts',
    category: 'Machine Learning',
    completed: false,
    started: false
  },
  // Data Basics tasks
  {
    id: 'tutorial-2',
    type: 'tutorial',
    title: 'Data Basics Tutorial',
    description: 'Learn about data preprocessing and analysis',
    category: 'Data Basics',
    completed: false,
    started: false
  },
  {
    id: 'quiz-2',
    type: 'quiz',
    title: 'Data Basics Quiz',
    description: 'Test your knowledge of data concepts',
    category: 'Data Basics',
    completed: false,
    started: false
  },
  // Data Preprocessing tasks
  {
    id: 'tutorial-3',
    type: 'tutorial',
    title: 'Data Preprocessing Tutorial',
    description: 'Learn about data cleaning and preparation',
    category: 'Data Preprocessing',
    completed: false,
    started: false
  },
  {
    id: 'quiz-3',
    type: 'quiz',
    title: 'Data Preprocessing Quiz',
    description: 'Test your knowledge of data preprocessing',
    category: 'Data Preprocessing',
    completed: false,
    started: false
  },
  // Model Training tasks
  {
    id: 'tutorial-4',
    type: 'tutorial',
    title: 'Model Training Tutorial',
    description: 'Learn about algorithm selection, data splitting, and column mapping',
    category: 'Model Training',
    completed: false,
    started: false
  },
  {
    id: 'quiz-4',
    type: 'quiz',
    title: 'Model Training Quiz',
    description: 'Test your knowledge of model training concepts',
    category: 'Model Training',
    completed: false,
    started: false
  },
  // Model Evaluation tasks
  {
    id: 'tutorial-5',
    type: 'tutorial',
    title: 'Model Evaluation Tutorial',
    description: 'Learn about model performance metrics and interpretation',
    category: 'Model Evaluation',
    completed: false,
    started: false
  },
  {
    id: 'quiz-5',
    type: 'quiz',
    title: 'Model Evaluation Quiz',
    description: 'Test your knowledge of model evaluation concepts',
    category: 'Model Evaluation',
    completed: false,
    started: false
  }
];

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_TASK':
      return state.map(task => 
        task.id === action.payload ? { ...task, started: true } : task
      );
    
    case 'COMPLETE_TASK':
      return state.map(task => 
        task.id === action.payload ? { ...task, completed: true, started: false } : task
      );
    
    case 'RESET_TASK':
      return state.map(task => 
        task.id === action.payload ? { ...task, completed: false, started: false } : task
      );

    case 'RESET_ALL_TASKS':
      return state.map(task => ({ ...task, completed: false, started: false }));

    default:
      return state;
  }
};

export default tasksReducer; 