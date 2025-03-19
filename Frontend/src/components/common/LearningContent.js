// Import images for tutorials
import ml from "../../static/images/Home Page.gif";
import ml2 from "../../static/images/howitwork.gif";
import ml3 from "../../static/images/typeofml.gif";
import sl from "../../static/images/supervisedl.gif";
import cl from "../../static/images/cl.gif";
import rg from "../../static/images/rg.gif";
import im from "../../static/images/Import Page.gif";
import dts from "../../static/images/dataset.gif";
import dpd from "../../static/images/dependent.gif";
import idpd from "../../static/images/independent.gif";
import asset1 from "../../static/images/land/asset-1.png";
import p1 from "../../static/images/Preprocessing1.gif";
import p2 from "../../static/images/Preprocessing2.gif";
import p3 from "../../static/images/Preprocessing3.gif";
import p4 from "../../static/images/Preprocessing4.gif";
import p5 from "../../static/images/Preprocessing5.gif";
import p6 from "../../static/images/Preprocessing6.png";
import p7 from "../../static/images/Preprocessing7.png";
import p8 from "../../static/images/Preprocessing8.gif";
import p9 from "../../static/images/Preprocessing9.gif";
import t1 from "../../static/images/Training1.gif";
import t2 from "../../static/images/Training2.gif";
import t3 from "../../static/images/Training3.gif";
import t4 from "../../static/images/Training4.gif";
import t5 from "../../static/images/Training5.svg";
import t6 from "../../static/images/Training6.gif";
import t7 from "../../static/images/Training7.gif";
import t8 from "../../static/images/Training8.gif";
import t9 from "../../static/images/Training9.gif";
import t10 from "../../static/images/Training10.gif";
import t11 from "../../static/images/Training11.gif";
import me1 from "../../static/images/ModelEvaluation1.png";
import me2 from "../../static/images/Modelevaluation2.gif";
import me4 from "../../static/images/ModelEvaluation4.png";
import me5 from "../../static/images/ModelEvaluation5.png";
import me6 from "../../static/images/ModelEvaluation6.png";
import me7 from "../../static/images/ModelEvaluation7.png";


// ML Tutorial Data
export const mlTutorialData = {
  "tab1": {
    label: "Machine Learning",
    title: "Machine Learning (ML)",
    subtitle: "An Introduction to How Machines Learn and Adapt",
    image: ml,
    sections: [
      {
        id: "ml_basics_1",
        title: "What is Machine Learning?",
        content: "Machine Learning (ML) is a subset of Artificial Intelligence (AI). It allows computers to learn and improve from data without explicit programming. It's like teaching a computer by showing it examples until it understands patterns. ML is used in various tasks, from predicting house prices to diagnosing diseases. It's everywhere—from self-driving cars to personalized recommendations!",
        image: ml
      },
      {
        id: "ml_basics_2",
        title: "How Does it Work?",
        content: "ML works through a series of steps: first, define the problem you want to solve (e.g., predicting house prices). Then, collect relevant data and preprocess it to clean and prepare for analysis. Next, train a model using this data to learn patterns and relationships. Finally, evaluate the model to see how well it performs, ensuring it's ready to make accurate predictions.",
        image: ml2
      },
      {
        id: "ml_basics_3",
        title: "Types of ML",
        content: "Machine Learning has three main approaches: Supervised learning uses labeled data to teach models, Unsupervised learning explores data to find hidden patterns, and Reinforcement learning improves through trial and error feedback. Conservation tasks often use supervised learning to predict species richness or identify priority habitats.",
        image: ml3
      }
    ]
  },
  "tab2": {
    label: "Supervised Learning",
    title: "Supervised Learning",
    subtitle: "Learning from Labeled Data to Make Predictions",
    image: sl,
    sections: [
      {
        id: "supervised_1",
        title: "What is Supervised Learning?",
        content: "Supervised learning is a type of machine learning where models are trained using labeled data. This means the dataset includes both input features (independent variables) and their corresponding correct outputs (dependent variable or target). The model identifies patterns to predict outcomes for new, unseen data. It includes two key types: classification (categorizing data) and regression (predicting numerical values).",
        image: sl
      },
      {
        id: "supervised_2",
        title: "What is Classification?",
        content: "Classification is about sorting data into different categories or classes. It's like having a bunch of different baskets and teaching a computer which basket to put each new item into based on its characteristics. For example, sorting emails into spam or inbox, or classifying bird species by photos. It is ideal for problems with distinct, non-overlapping outcomes. It answers \"Yes or No\" questions, or \"Which category does this belong to?\" It's all about putting things into the right groups",
        image: cl
      },
      {
        id: "supervised_3",
        title: "What is Regression?",
        content: "Regression helps in situations where you need to forecast a quantity or continuous numerical values. For example, predicting future sales figures, housing prices, or temperature. It's useful for answering questions like \"How much?\" or \"How many?\" The goal is to come up with a model that can take your inputs and forecast a number as accurately as possible.",
        image: rg
      }
    ]
  }
}; 

// Data Basics Tutorial Data
export const dataBasicsTutorialData = {
  "tab1": {
    label: "Data Basics",
    title: "Data Basics",
    subtitle: "Understanding the Foundation of Machine Learning",
    image: im,
    sections: [
      {
        id: "section1_1",
        title: "Types of data",
        content: "There are two types of data in machine learning: numerical and categorical. Numerical data includes continuous values, like height or temperature, and discrete counts, like the number of rooms in a house. Categorical data is divided into nominal categories, which have no order (e.g., colors like red, blue), and ordinal categories, which have a meaningful order (e.g., rankings like small, medium, large). Both types are essential to represent diverse information and uncover patterns in machine learning tasks.",
        image: im
      },
      {
        id: "section1_2",
        title: "What kind of dataset can be used for ML?",
        content: "Imagine you're putting together a puzzle. To do this, you need two things: the puzzle pieces (features) and the picture on the box to guide you (target). In machine learning, datasets work the same way. Machine learning uses datasets with input features and a target variable to teach models how to make predictions.",
        image: dts
      }
    ]
  },
  "tab2": {
    label: "Key Parts of a Dataset",
    title: "Key Parts of a Dataset",
    subtitle: "Breaking Down the Elements of Data",
    image: asset1,
    sections: [
      {
        id: "section2_1",
        title: "What is dependent variable?",
        content: "Dependent variables, also known as targets, represent the outcome or value that a model aims to predict or explain—the equivalent of the \"picture on the box\" that guides the puzzle assembly. For example, in a task like predicting house prices, the target would be the actual price of the house, serving as the benchmark against which the model's predictions are evaluated. These variables are influenced by independent variables (features), which provide the input data used to make predictions.",
        image: dpd
      },
      {
        id: "section2_2",
        title: "What are independent variables?",
        content: "Independent variables, also known as features, are the inputs or puzzle pieces. They help the model understand what factors might influence an outcome. For example, in predicting house prices, features could include square footage, number of bedrooms, and location.",
        image: idpd
      }
    ]
  }
};

// Data Preprocessing Tutorial Data
export const dataPreprocessingTutorialData = {
  "tab1": {
    label: "Preprocessing",
    title: "Preprocessing",
    subtitle: "Preparing Raw Data for Machine Learning",
    image: idpd,
    sections: [
      {
        id: "section1_1",
        title: "What is preprocessing?",
        content: "Preprocessing transforms raw, messy data into a clean, usable format. This includes handling missing values, scaling, or formatting to make sure the data is ready for analysis. It's like organizing a pile of random LEGO pieces by size, color, and type before building a model—you need everything sorted to create something meaningful!",
        image: p1
      },
      {
        id: "section1_2",
        title: "Why do we need preprocessing?",
        content: "Imagine trying to bake a cake with missing ingredients or mismatched measurements—your results will be inconsistent. In machine learning, data is your main ingredient, and if it's messy or incomplete, your model won't perform well. Preprocessing ensures your data is clean, consistent, and ready for use, leading to more accurate predictions. Without preprocessing, errors, inconsistencies, or missing values can confuse the model and lead to poor predictions.",
        image: p2
      },
      {
        id: "section1_3",
        title: "How does it work?",
        content: "Preprocessing works by preparing raw data to make it usable for machine learning. It includes cleaning (removing errors or missing values), transforming (converting data into a suitable format), integrating (combining data from different sources), and reducing (simplifying data by removing unnecessary parts). This ensures the model works efficiently and accurately, just like organizing tools before starting a project.",
        image: p3
      }
    ]
  },
  "tab2": {
    label: "Fit For Use",
    title: "Fit For Use",
    subtitle: "Handling Missing and Incomplete Data",
    image: idpd,
    sections: [
      {
        id: "section2_1",
        title: "Why is it important?",
        content: "Think of your data as the ingredients for baking a cake. If key ingredients are missing or the ratios are off (like not having enough rows of data), the final cake won't turn out right. Similarly, incomplete or insufficient data can confuse the model, leading to poor predictions. Ensuring your dataset is complete and has enough rows ensures the \"recipe\" for your model works as intended, leading to accurate and reliable results.",
        image: p4
      },
      {
        id: "section2_2",
        title: "How to deal with missing values?",
        content: "Handle missing values by: (1) Removing incomplete rows/columns with little relevance to the analysis; (2) Filling gaps with averages, medians, or predictive imputation; (3) Ensure no more than 10-15% of data is missing for reliable results.",
        image: p5
      }
    ]
  },
  "tab3": {
    label: "Data Types",
    title: "Data Types",
    subtitle: "Understanding Different Types of Data for ML",
    image: idpd,
    sections: [
      {
        id: "section3_1",
        title: "Numerical data",
        content: "Numerical data represents measurable quantities. It can be continuous (e.g., \"House Price\" = $350,000) or discrete (e.g., \"Number of Rooms\" = 3).",
        image: p6
      },
      {
        id: "section3_2",
        title: "Categorical data",
        content: "Categorical/ discrete data represents labels or categories, often text or numbers with distinct groups. Example: \"City\" = New York, \"Payment Method\" = Credit Card.",
        image: p7
      }
    ]
  },
  "tab4": {
    label: "Distribution of Feature",
    title: "Distribution of Feature",
    subtitle: "Visualizing Data to Spot Bias, Outliers, and Imbalances",
    image: idpd,
    sections: [
      {
        id: "section4_1",
        title: "How to determine class imbalance?",
        content: "Look for skewed distributions in target variables. For example, if one class appears 90% of the time and another only 10%, it indicates imbalance. This can often lead to models being biased toward the majority class, reducing their ability to accurately predict the minority class. Visual tools like bar charts or calculating class distribution percentages can quickly highlight the extent of the imbalance.",
        image: p8
      },
      {
        id: "section4_2",
        title: "How to deal with class imbalance?",
        content: "(1) Oversampling: Increase the data for the minority class by duplicating or generating synthetic samples (e.g., SMOTE); (2) Undersampling: Reduce the data for the majority class to balance proportions; (3) Weighted Algorithms: Assign higher weights to the minority class during training to ensure it gets more focus.",
        image: p9
      }
    ]
  }
};

// Model Training Tutorial Data
export const modelTrainingTutorialData = {
    "tab1": {
      label: "Algorithm",
      title: "Algorithm",
      subtitle: "Understanding the Role of Algorithms in ML",
      image: rg,
      sections: [
        {
          id: "section1_1",
          title: "What is an algorithm in ML?",
          content: "An algorithm in machine learning is a set of rules or steps the model follows to learn patterns from data. It processes input data, identifies relationships, and uses them to make predictions. Different algorithms are suited for different types of problems, such as predicting numbers or classifying data into categories.",
          image: t1
        },
        {
          id: "section1_2",
          title: "Logistic regression",
          content: "Logistic regression is a simple yet powerful algorithm used for classification tasks. It predicts the probability of a data point belonging to a particular class, like determining if an email is spam or not. Instead of a straight line, it uses an \"S-shaped\" curve to map inputs to probabilities, making it ideal for binary outcomes like yes/no or pass/fail.",
          image: t2
        },
        {
          id: "section1_3",
          title: "Decision tree",
          content: "Decision trees work by splitting data into branches based on feature values. They are easy to understand, handle both numerical and categorical data, and are commonly used for classification and regression problems.",
          image: t3
        }
      ]
    },
    "tab2": {
      label: "Training, Validation, Test Split",
      title: "Training, Validation, Test Split",
      subtitle: "Why Splitting Data Matters for Model Accuracy",
      image: rg,
      sections: [
        {
          id: "section2_1",
          title: "What is the optimal split ratio?",
          content: "A common split is 70-80% for training, and 10-15% for testing. The training data helps the model learn, validation data fine-tunes it, and test data evaluates its accuracy on unseen information.",
          image: t4
        },
        {
          id: "section2_2",
          title: "Why is split ratio important?",
          content: "Proper split ratios prevent overfitting or underfitting. Training data teaches the model, validation helps adjust parameters, and testing ensures the model generalizes well to new data. Without a good split, your model might perform well on training data but fail in real-world scenarios.",
          image: t5
        }
      ]
    },
    "tab3": {
      label: "Prediction & ID Column",
      title: "Prediction & ID Column",
      subtitle: "Understanding Key Columns in Your Dataset",
      image: rg,
      sections: [
        {
          id: "section3_1",
          title: "What is prediction column?",
          content: "The prediction column is the dependent variable (target) that the model is trained to predict. For example, in a dataset about house sales, the prediction column could be \"Price.\" It contains the actual outcomes the model compares its predictions to during evaluation.",
          image: t6
        },
        {
          id: "section3_2",
          title: "What is ID column?",
          content: "The ID column contains unique identifiers for each data entry, such as transaction IDs or user IDs. While essential for tracking or organizing data, ID columns are not used for training as they do not provide meaningful patterns for predictions.",
          image: t7
        }
      ]
    },
    "tab4": {
      label: "Feature Selection",
      title: "Feature Selection",
      subtitle: "Choosing the Right Features for Better Models",
      image: rg,
      sections: [
        {
          id: "section4_1",
          title: "What is feature selection?",
          content: "Feature selection is the process of identifying the most relevant inputs (features) for a model. It reduces the dataset to focus on critical variables that impact predictions, removing redundant or irrelevant data. This improves model efficiency and accuracy. For example, when predicting house prices, focusing on features like location and square footage is more useful than including unrelated details like the color of the mailbox.",
          image: t8
        },
        {
          id: "section4_2",
          title: "Why is feature selection important?",
          content: "(1) Avoid Overfitting: Reduces the risk of the model learning irrelevant patterns; (2) Save Time: Speeds up training by focusing on fewer, essential features; (3) Improve Accuracy: Eliminates noise from unnecessary data, enhancing model performance. Imagine trying to guess a cake's flavor based on hundreds of random ingredients; selecting only the key ones, like chocolate or vanilla, makes it easier to identify.",
          image: t9
        },
        {
          id: "section4_3",
          title: "Which features to prioritize?",
          content: "Prioritizing features is like packing for a trip: essential items (e.g., passport, clothes) are like key features which are critical for success. Useful extras (e.g., a power bank) are moderately relevant, adding convenience but not vital. Unnecessary items (e.g., ski boots for a beach trip) are irrelevant and only add clutter. Choosing the right features ensures your model is efficient and accurate, just like smart packing makes your journey smoother.",
          image: t10
        },
        {
          id: "section4_4",
          title: "Example of feature selection methods",
          content: "Feature selection methods include: (1) Domain Knowledge involves relying on expert insights to identify the most important features; (2) Correlation Analysis focuses on measuring the relationships between features and the target variable to determine which are most significant; (3) Recursive Feature Elimination is a technique that ranks features based on their contribution to the model and removes the least important ones through an iterative process. Usually, the process begins with domain knowledge to establish essential features and then use correlation and algorithmic methods to refine the selection.",
          image: t11
        }
      ]
    }
  };

// Model Evaluation Tutorial Data
export const modelEvaluationTutorialData = {
  "tab1": {
    label: "General Evaluation Methods",
    title: "Understanding How Models Work",
    subtitle: "Simple ways to see how machine learning models make decisions",
    image: "idpd",
    sections: [
      {
        id: "eval_methods_1",
        title: "SHAP values",
        content: "SHAP values show which features matter most for predictions. Think about predicting a car's price: SHAP values tell you how much things like \"engine size,\" \"brand,\" or \"car age\" affect the price. Positive values push the price up, negative values bring it down. This helps you understand why the model made its prediction.",
        image: me1
      },
      {
        id: "eval_methods_2",
        title: "What if…",
        content: "What-if testing lets you play around with different inputs to see what happens. For example: \"What if this car had more horsepower? How would that change its price?\" It's like changing one ingredient in a recipe to see how it affects the taste. This helps you understand how the model responds to changes.",
        image: me2
      }
    ]
  },
  "tab2": {
    label: "Evaluation for Classification",
    title: "How Good Is Your Sorting Model?",
    subtitle: "Ways to check if your model puts things in the right groups",
    image: "idpd",
    sections: [
      {
        id: "classification_eval_1",
        title: "Precision & Recall",
        content: "Precision measures accuracy when the model makes positive predictions: 'When our model identifies something as spam, how often is it correct?' Recall measures completeness: 'What percentage of all actual spam emails does our model successfully catch?' Both metrics are important for effective models - precision prevents false alarms while recall ensures you don't miss important cases.",
        image: me4
      },
      {
        id: "classification_eval_2",
        title: "Confusion matrix",
        content:  "A confusion matrix shows if your model's predictions match reality. It has four parts: (1) Predicted: spam, Actual: spam - you caught real spam; (2) Predicted: not spam, Actual: not spam - you correctly let normal emails through; (3) Predicted: spam, Actual: not spam - you mistakenly blocked good emails; (4) Predicted: not spam, Actual: spam - you missed some spam. This helps you see if your model is making the right kinds of decisions.",
        image: me5
      }
    ]
  },
  "tab3": {
    label: "Evaluation for Regression",
    title: "How Close Are Your Number Predictions?",
    subtitle: "Ways to check if your number predictions are on target",
    image: "idpd",
    sections: [
      {
        id: "regression_eval_1",
        title: "Accuracy",
        content: "Accuracy in regression is about how close your predictions are to the actual numbers. Smaller differences between predicted and actual car prices mean better accuracy. The goal is simple: get as close as possible to the right number.",
        image: me6
      },
      {
        id: "regression_eval_2",
        title: "Regression statistics",
        content: "Regression statistics measure prediction accuracy. MAE (Mean Absolute Error) tells you the average difference between predicted and actual values - for example, $2,000 off when predicting car prices. R-squared shows what percentage of the target's variation your model explains - an R-squared of 80 means your model accounts for 80% of price variations. Better statistics indicate more reliable predictions, while weaker numbers suggest your model might need improvements.",
        image: me7
      }
    ]
  }
};

// Quiz Questions
export const mlQuizQuestions = [
  {
    question: "What is the relationship between Machine Learning and Artificial Intelligence?",
    options: [
      "Machine Learning is a completely separate field from AI",
      "Machine Learning is a superset of AI",
      "Machine Learning is a subset of AI",
      "They are the same thing"
    ],
    correctAnswer: "Machine Learning is a subset of AI",
    explanation: "Machine Learning is a branch of AI that enables computers to learn from data and improve without explicit programming, powering applications from recommendations to self-driving cars."
  },
  {
    question: "What are the main steps in the Machine Learning process?",
    options: [
      "Collect data, train model, deploy model",
      "Define problem, collect data, preprocess data, train model, evaluate model",
      "Train model, test model, deploy model",
      "Collect data, clean data, deploy model"
    ],
    correctAnswer: "Define problem, collect data, preprocess data, train model, evaluate model",
    explanation: "The ML process involves defining the problem, collecting relevant data, preprocessing it, training a model to learn patterns, and evaluating its performance."
  },
  {
    question: "What are the three main approaches to Machine Learning?",
    options: [
      "Predictive, Analytical, and Experimental learning",
      "Basic, Intermediate, and Advanced learning",
      "Supervised, Unsupervised, and Reinforcement learning",
      "Classification, Regression, and Clustering learning"
    ],
    correctAnswer: "Supervised, Unsupervised, and Reinforcement learning",
    explanation: "The three main approaches are Supervised learning (using labeled data), Unsupervised learning (finding patterns), and Reinforcement learning (learning through feedback)."
  },
  {
    question: "What is the key characteristic of supervised learning?",
    options: [
      "It requires no data to train",
      "It uses unlabeled data",
      "It uses labeled data for training",
      "It only works with numerical data"
    ],
    correctAnswer: "It uses labeled data for training",
    explanation: "Supervised learning uses labeled data that includes both input features and their corresponding correct outputs to train predictive models."
  },
  {
    question: "What is the main difference between classification and regression in supervised learning?",
    options: [
      "Classification is faster than regression",
      "Classification sorts data into categories while regression predicts numerical values",
      "Regression is more accurate than classification",
      "Classification uses more data than regression"
    ],
    correctAnswer: "Classification sorts data into categories while regression predicts numerical values",
    explanation: "Classification assigns data to categories (like spam/not spam), while regression predicts continuous numerical values (like house prices or temperature)."
  },
  {
    question: "What type of questions is regression best suited to answer?",
    options: [
      "'Yes or No' questions",
      "'Which category?' questions",
      "'How much?' or 'How many?' questions",
      "'True or False' questions"
    ],
    correctAnswer: "'How much?' or 'How many?' questions",
    explanation: "Regression answers quantitative questions like 'How much?' or 'How many?' by predicting numerical values rather than categorical outcomes."
  },
  {
    question: "What is a real-world example of classification in action?",
    options: [
      "Predicting tomorrow's temperature",
      "Sorting emails into spam or inbox",
      "Estimating future sales figures",
      "Forecasting housing prices"
    ],
    correctAnswer: "Sorting emails into spam or inbox",
    explanation: "Email spam filtering is a classic classification example, where the model categorizes incoming messages as either legitimate or unwanted spam."
  },
  {
    question: "What type of prediction would require regression analysis?",
    options: [
      "Identifying spam emails",
      "Categorizing bird species",
      "Predicting house prices",
      "Sorting items into baskets"
    ],
    correctAnswer: "Predicting house prices",
    explanation: "House price prediction requires regression because it involves forecasting a continuous numerical value based on features like location and size."
  }
];

export const dataBasicsQuizQuestions = [
  {
    question: "What are the two main types of data in machine learning?",
    options: [
      "Binary and textual data",
      "Numerical and categorical data", // correct - index 1
      "Structured and unstructured data", 
      "Integer and floating-point data"
    ],
    correctAnswer: "Numerical and categorical data",
    explanation: "Machine learning primarily uses numerical data (continuous values and counts) and categorical data (nominal and ordinal categories)."
  },
  {
    question: "How is categorical data classified?",
    options: [
      "Binary and continuous",
      "Integer and decimal",
      "Nominal (no order) and ordinal (with order)", // correct - index 2
      "Quantitative and qualitative"
    ],
    correctAnswer: "Nominal (no order) and ordinal (with order)",
    explanation: "Categorical data is either nominal with no inherent order (like colors) or ordinal with meaningful ranking (like size: small, medium, large)."
  },
  {
    question: "In the puzzle analogy for machine learning datasets, what represents the 'picture on the box'?",
    options: [
      "The features",
      "The training data",
      "The algorithm",
      "The target variable" // correct - index 3
    ],
    correctAnswer: "The target variable",
    explanation: "The target variable is like the puzzle's picture, guiding the solution, while features are the puzzle pieces used to reconstruct it."
  },
  {
    question: "What is a dependent variable in machine learning?",
    options: [
      "The data preprocessing steps",
      "The outcome or value that a model aims to predict", // correct - index 1
      "The input features used for prediction",
      "The model parameters"
    ],
    correctAnswer: "The outcome or value that a model aims to predict",
    explanation: "The dependent variable is the outcome the model predicts, influenced by independent variables (features) that serve as inputs."
  },
  {
    question: "What type of numerical data would 'temperature' be classified as?",
    options: [
      "Nominal data",
      "Ordinal data",
      "Discrete counts",
      "Continuous data" // correct - index 3
    ],
    correctAnswer: "Continuous data",
    explanation: "Temperature is continuous numerical data because it can take any value within a range, not just specific discrete points."
  },
  {
    question: "In house price prediction, what role do features like square footage and number of bedrooms play?",
    options: [
      "Target variables",
      "Dependent variables",
      "Independent variables", // correct - index 2
      "Outcome variables"
    ],
    correctAnswer: "Independent variables",
    explanation: "Square footage and bedrooms are independent variables (features) that help predict the dependent variable (house price)."
  },
  {
    question: "Which of these is an example of ordinal categorical data?",
    options: [
      "Temperature readings",
      "Names of cities",
      "Size rankings (small, medium, large)", // correct - index 2
      "Colors (red, blue, green)"
    ],
    correctAnswer: "Size rankings (small, medium, large)",
    explanation: "Size rankings are ordinal because they have a meaningful order (small < medium < large), unlike nominal data like colors."
  },
  {
    question: "What is the relationship between features and the target variable in machine learning?",
    options: [
      "Targets are used to predict features",
      "Features are used to predict the target variable", // correct - index 1
      "Features and targets are the same thing",
      "There is no relationship between them"
    ],
    correctAnswer: "Features are used to predict the target variable",
    explanation: "Features (independent variables) serve as inputs that the model uses to predict or estimate the target variable (dependent variable)."
  }
];

export const dataPreprocessingQuizQuestions = [
  {
    question: "What process transforms raw data into a format suitable for machine learning algorithms?",
    options: [
      "Data visualization",
      "Data preprocessing",
      "Data storage",
      "Data encryption"
    ],
    correctAnswer: "Data preprocessing",
    explanation: "Data preprocessing transforms raw data into a clean, usable format by handling missing values, scaling, and formatting for analysis."
  },
  {
    question: "Which of the following is NOT typically included in data preprocessing steps?",
    options: [
      "Cleaning data by removing errors",
      "Transforming data into suitable formats",
      "Creating the final prediction model",
      "Reducing data by removing unnecessary parts"
    ],
    correctAnswer: "Creating the final prediction model",
    explanation: "Preprocessing includes cleaning, transforming, and reducing data, but creating the prediction model is a separate step that follows preprocessing."
  },
  {
    question: "Why might a dataset with a large percentage of missing values be problematic?",
    options: [
      "It requires more storage space",
      "It can lead to unreliable model predictions",
      "It makes the visualization more complex",
      "It increases the processing speed"
    ],
    correctAnswer: "It can lead to unreliable model predictions",
    explanation: "Excessive missing data means remaining information may not accurately represent patterns, leading to unreliable or biased predictions."
  },
  {
    question: "What is a common threshold for acceptable missing data in a dataset?",
    options: [
      "No more than 10-15%",
      "No more than 30-40%",
      "No more than 50-60%",
      "Any amount is acceptable"
    ],
    correctAnswer: "No more than 10-15%",
    explanation: "Generally, datasets should have no more than 10-15% missing values to maintain reliability and statistical validity."
  },
  {
    question: "Which of these is an example of continuous numerical data?",
    options: [
      "Number of rooms in a house",
      "House price ($350,000)",
      "City name",
      "Payment method"
    ],
    correctAnswer: "House price ($350,000)",
    explanation: "House price is continuous numerical data because it can take any value within a range, unlike discrete data with specific values."
  },
  {
    question: "What problem occurs when a machine learning dataset has 95% of samples in one class and 5% in another?",
    options: [
      "Feature scaling issue",
      "Dimensionality problem",
      "Class imbalance",
      "Data leakage"
    ],
    correctAnswer: "Class imbalance",
    explanation: "Class imbalance occurs when classes aren't equally represented, potentially biasing models toward the majority class and reducing minority class accuracy."
  },
  {
    question: "Which technique creates new synthetic examples of the minority class to address imbalanced data?",
    options: [
      "Random undersampling",
      "Feature selection",
      "SMOTE (Synthetic Minority Over-sampling Technique)",
      "Z-score normalization"
    ],
    correctAnswer: "SMOTE (Synthetic Minority Over-sampling Technique)",
    explanation: "SMOTE generates synthetic examples of minority classes by interpolating between existing instances, helping balance class distribution."
  },
  {
    question: "When handling categorical data like 'City' or 'Payment Method' for machine learning, what must typically be done?",
    options: [
      "Remove it from the dataset",
      "Convert it to numerical representation",
      "Keep it unchanged as text",
      "Use only as labels, not features"
    ],
    correctAnswer: "Convert it to numerical representation",
    explanation: "Categorical data must be converted to numerical format through techniques like one-hot encoding since most ML algorithms require numerical inputs."
  }
];

export const modelTrainingQuizQuestions = [
    {
      question: "What is a machine learning algorithm?",
      options: [
        "A type of computer hardware",
        "A set of rules or steps the model follows to learn patterns from data",
        "A database management system",
        "The final output of model training"
      ],
      correctAnswer: "A set of rules or steps the model follows to learn patterns from data",
      explanation: "An algorithm is a set of rules that processes input data, identifies patterns, and uses them to make predictions."
    },
    {
      question: "What is logistic regression primarily used for?",
      options: [
        "Predicting numerical values",
        "Classification tasks",
        "Feature selection",
        "Data cleaning"
      ],
      correctAnswer: "Classification tasks",
      explanation: "Logistic regression predicts the probability of data belonging to a particular class, making it ideal for binary classification problems."
    },
    {
      question: "What is the recommended split ratio for training and test data?",
      options: [
        "50-50 split",
        "70-80% for training, 10-15% for testing",
        "90-10 split",
        "100-0 split"
      ],
      correctAnswer: "70-80% for training, 10-15% for testing",
      explanation: "A common split uses 70-80% for training the model and 10-15% for testing its performance on unseen data."
    },
    {
      question: "Why is a proper data split ratio important?",
      options: [
        "It makes training faster",
        "It reduces the size of the dataset",
        "It prevents overfitting or underfitting",
        "It eliminates the need for validation"
      ],
      correctAnswer: "It prevents overfitting or underfitting",
      explanation: "Proper splits prevent overfitting (memorizing training data) and underfitting (failing to learn patterns), ensuring good real-world performance."
    },
    {
      question: "What is the prediction column in a dataset?",
      options: [
        "A column containing the model's guesses",
        "The dependent variable that the model is trained to predict",
        "A column of randomly generated values for testing",
        "A column used only during validation"
      ],
      correctAnswer: "The dependent variable that the model is trained to predict",
      explanation: "The prediction column contains the target values the model learns to predict and is used to evaluate prediction accuracy."
    },
    {
      question: "Why are ID columns not used for training?",
      options: [
        "They contain too many unique values",
        "They are too difficult to process",
        "They do not provide meaningful patterns for predictions",
        "They would make the model too accurate"
      ],
      correctAnswer: "They do not provide meaningful patterns for predictions",
      explanation: "ID columns are just unique identifiers without predictive value and could lead to false patterns if included in training."
    },
    {
      question: "What is feature selection?",
      options: [
        "Creating new features from existing ones",
        "Identifying the most relevant inputs for a model",
        "Selecting which model to use",
        "Determining how many categories to include"
      ],
      correctAnswer: "Identifying the most relevant inputs for a model",
      explanation: "Feature selection identifies the most important variables for prediction, removing irrelevant or redundant features to improve model performance."
    },
    {
      question: "Which of the following is NOT a benefit of feature selection?",
      options: [
        "Reduces the risk of overfitting",
        "Speeds up training",
        "Guarantees 100% model accuracy",
        "Eliminates noise from unnecessary data"
      ],
      correctAnswer: "Guarantees 100% model accuracy",
      explanation: "Feature selection improves efficiency and can reduce overfitting, but it cannot guarantee perfect accuracy as other factors affect performance."
    }
  ];

export const modelEvaluationQuizQuestions = [
  {
    question: "What do SHAP values primarily show about machine learning models?",
    options: [
      "How fast the model processes data",
      "Which features matter most for predictions",
      "How many layers the model has",
      "When the model was last updated"
    ],
    correctAnswer: "Which features matter most for predictions",
    explanation: "SHAP values reveal feature importance by showing how much each feature contributes to pushing predictions higher or lower."
  },
  {
    question: "In the context of 'What-if' testing, what is the main purpose of this approach?",
    options: [
      "To speed up model training",
      "To see how changing inputs affects predictions",
      "To fix bugs in the model code",
      "To reduce the number of features needed"
    ],
    correctAnswer: "To see how changing inputs affects predictions",
    explanation: "What-if testing lets you experiment with different input values to understand how changes affect the model's predictions."
  },
  {
    question: "What does 'Precision' measure in classification models?",
    options: [
      "How many decimal places are in predictions",
      "When the model says 'yes', how often it is right",
      "How quickly the model makes predictions",
      "The total number of predictions made"
    ],
    correctAnswer: "When the model says 'yes', how often it is right",
    explanation: "Precision measures the accuracy of positive predictions—when the model identifies something as positive, how often it's correct."
  },
  {
    question: "What is a 'False Positive' in a confusion matrix?",
    options: [
      "When your model predicted 'yes' but the actual result was 'no'",
      "When your model predicted 'no' but the actual result was 'yes'",
      "When your model predicted 'yes' and the actual result was 'yes'",
      "When your model predicted 'no' and the actual result was 'no'"
    ],
    correctAnswer: "When your model predicted 'yes' but the actual result was 'no'",
    explanation: "A false positive occurs when the model incorrectly predicts a positive outcome, like marking a legitimate email as spam."
  },
  {
    question: "What does MAE stand for in regression evaluation?",
    options: [
      "Maximum Accuracy Estimate",
      "Model Accuracy Evaluation",
      "Mean Absolute Error",
      "Multiple Algorithm Execution"
    ],
    correctAnswer: "Mean Absolute Error",
    explanation: "MAE measures the average magnitude of errors in predictions, without considering their direction (positive or negative)."
  },
  {
    question: "What does an R-squared value of 80 mean in regression?",
    options: [
      "The model is 80% fast",
      "The model explains 80% of why the target values change",
      "The model uses 80% of available data",
      "The model has an 80% chance of being correct"
    ],
    correctAnswer: "The model explains 80% of why the target values change",
    explanation: "An R-squared of 80 means the model explains 80% of the variance in the target variable, indicating good predictive power."
  },
  {
    question: "What is 'Recall' measuring in classification models?",
    options: [
      "How many times the model was retrained",
      "How many actual positives the model identified correctly",
      "How well the model remembers previous data",
      "How fast the model can be recalled into memory"
    ],
    correctAnswer: "How many actual positives the model identified correctly",
    explanation: "Recall measures the proportion of actual positives correctly identified—like what percentage of all spam emails were caught."
  },
  {
    question: "What are the four main components of a confusion matrix?",
    options: [
      "True Positives, True Negatives, False Positives, False Negatives",
      "Accuracy, Precision, Recall, F1-Score",
      "Training, Testing, Validation, Production",
      "Learn, Evaluate, Adjust, Predict"
    ],
    correctAnswer: "True Positives, True Negatives, False Positives, False Negatives",
    explanation: "A confusion matrix shows correct and incorrect predictions: true positives, true negatives, false positives, and false negatives."
  }
];
