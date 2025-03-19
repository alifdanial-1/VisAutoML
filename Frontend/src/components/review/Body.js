import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Tooltip,
  Paper,
  Grid,
  Divider,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  Card as MuiCard,
  CardContent
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "./Table";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { saveDescription } from "../../actions/modelAction";
import { useState, useCallback, useEffect } from "react";
import Chart from "./Chart";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { tooltipClasses } from '@mui/material/Tooltip';
import "../../App.css";
import EditDialog from "../common/EditDialog";
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes } from "@mui/x-data-grid";
// import { useEffect, useRef } from "react";
import { withStyles } from "@mui/styles";
import { 
  ArrowBackIos, 
  ArrowForwardIos, 
  WarningAmber, 
  Info, 
  ErrorOutline, 
  PriorityHigh, 
  ReportProblem, 
  TrendingDown,
  DeleteOutline, 
  DataUsage, 
  Functions, 
  Category, 
  CompareArrows, 
  ArrowForward, 
  RemoveCircleOutline, 
  Merge, 
  Search, 
  Transform,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningAmberIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import TutorialComponent from "../common/TutorialComponent";
import QuizDialog from "../common/QuizDialog";
import EducationalFAB from "../common/Fab";
import HistogramChart from "./HistogramChart";
import MissingValuesHeatmap from "./MissingValuesHeatmap";
import CorrelationMatrix from "./CorrelationMatrix";
import OutlierBoxplot from './OutlierBoxplot';

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
} from '../common/LearningContent';



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

// Advanced Data Quality Component
const AdvancedDataQuality = ({ response }) => {
  // Distribution Analysis state
  const [selectedDistributionFeature, setSelectedDistributionFeature] = useState('');
  
  // Missing Values Analysis state
  const [selectedMissingValuesFeature, setSelectedMissingValuesFeature] = useState('all');
  
  // Correlation Analysis state
  const [selectedCorrelationFeature, setSelectedCorrelationFeature] = useState('all');
  
  // Outlier Analysis state
  const [selectedOutlierFeature, setSelectedOutlierFeature] = useState('all');

  // Tab selection state
  const [selectedTab, setSelectedTab] = useState('missing_values');
  
  // Remove old state variables
  // const [selectedFeature, setSelectedFeature] = useState('');
  // const [selectedView, setSelectedView] = useState('all');
  const histogram = useSelector((state) => state.model.histogram);
  const [distributionInfo, setDistributionInfo] = useState({
    skewness: 0,
    kurtosis: 0,
    isNormal: true,
    dataType: 'unknown'
  });
  const [correlationInfo, setCorrelationInfo] = useState({
    highCorrelations: [],
    hasMulticollinearity: false
  });
  const [outlierInfo, setOutlierInfo] = useState({
    totalOutliers: 0,
    columnsWithOutliers: [],
    worstColumn: null
  });
  const [missingValuesInfo, setMissingValuesInfo] = useState({
    totalMissingValues: 0,
    featuresWithMissing: [],
    worstFeature: null,
    percentageOfDataMissing: 0
  });
  const [dataQualitySummary, setDataQualitySummary] = useState({
    summary: "",
    recommendations: [],
    groupedRecommendations: {},
    overallQuality: "medium" // "good", "medium", or "poor"
  });
  
  // Add new state for overall distribution information
  const [overallDistributionInfo, setOverallDistributionInfo] = useState({
    skewedFeatures: [],
    normalFeatures: [],
    constantFeatures: [],
    categoricalFeatures: [],
    percentageSkewed: 0
  });

  // Add new state for feature severity info
  const [featureSeverityMap, setFeatureSeverityMap] = useState({});

  // Add new state for missing values severity info
  const [missingValuesSeverityMap, setMissingValuesSeverityMap] = useState({});

  // Add new state for correlation severity info
  const [correlationSeverityMap, setCorrelationSeverityMap] = useState({});

  // Add new state for outlier severity info
  const [outlierSeverityMap, setOutlierSeverityMap] = useState({});

  // Add function to analyze feature severity
  const getFeatureSeverity = (feature) => {
    if (!histogram || !histogram[feature]) return { severity: "info", message: "" };
    
    try {
      const data = histogram[feature];
      
      // Check if data exists and is numeric
      if (!Array.isArray(data) || data.length === 0) {
        return { severity: "error", message: "No data available" };
      }

      const numericData = data.filter(d => typeof d === 'number' && !isNaN(d));
      if (numericData.length === 0) {
        return { severity: "info", message: "Categorical feature" };
      }

      // Check for constant values
      const isConstant = numericData.every(val => val === numericData[0]);
      if (isConstant) {
        return { severity: "warning", message: "Constant values" };
      }

      // Calculate statistics
      const mean = numericData.reduce((sum, val) => sum + val, 0) / numericData.length;
      const variance = numericData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericData.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev === 0) {
        return { severity: "warning", message: "Zero variance" };
      }

      // Calculate skewness
      const skewness = numericData.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / numericData.length;
      
      // Determine severity based on skewness
      if (Math.abs(skewness) < 0.5) {
        return { severity: "success", message: "Normal distribution" };
      } else if (Math.abs(skewness) > 1.5) {
        return { severity: "warning", message: "Highly skewed" };
      } else {
        return { severity: "info", message: "Slightly skewed" };
      }
    } catch (error) {
      return { severity: "error", message: "Analysis error" };
    }
  };

  // Add function to analyze missing values severity
  const getMissingValuesSeverity = (feature) => {
    if (!histogram || !histogram[feature]) return { severity: "info", message: "" };
    
    try {
      const data = histogram[feature];
      
      // Check if data exists
      if (!Array.isArray(data) || data.length === 0) {
        return { severity: "error", message: "No data available" };
      }

      // Calculate missing values
      const missingCount = data.filter(val => 
        val === null || val === undefined || val === '' || 
        (typeof val === 'string' && val.trim() === '')
      ).length;
      
      const missingPercentage = (missingCount / data.length) * 100;
      
      // Determine severity based on percentage of missing values
      if (missingCount === 0) {
        return { severity: "success", message: "No missing values" };
      } else if (missingPercentage > 50) {
        return { severity: "error", message: `Critical: ${missingPercentage.toFixed(1)}% missing` };
      } else if (missingPercentage > 20) {
        return { severity: "warning", message: `High: ${missingPercentage.toFixed(1)}% missing` };
      } else {
        return { severity: "info", message: `${missingPercentage.toFixed(1)}% missing` };
      }
    } catch (error) {
      return { severity: "error", message: "Analysis error" };
    }
  };

  // Add function to analyze correlation severity
  const getCorrelationSeverity = (feature) => {
    if (!correlationInfo || !correlationInfo.highCorrelations) return { severity: "info", message: "" };
    
    try {
      // Find all correlations involving this feature
      const featureCorrelations = correlationInfo.highCorrelations.filter(
        corr => corr.feature1 === feature || corr.feature2 === feature
      );
      
      if (featureCorrelations.length === 0) {
        return { severity: "success", message: "No significant correlations" };
      }

      // Find the highest absolute correlation for this feature
      const maxCorrelation = Math.max(
        ...featureCorrelations.map(corr => Math.abs(corr.correlation))
      );

      // Get the correlated features
      const correlatedFeatures = featureCorrelations.map(corr => {
        const otherFeature = corr.feature1 === feature ? corr.feature2 : corr.feature1;
        return `${otherFeature} (${corr.correlation.toFixed(2)})`;
      });

      // Determine severity based on correlation strength
      if (maxCorrelation > 0.9) {
        return { 
          severity: "error", 
          message: `Very strong correlation with: ${correlatedFeatures.join(", ")}` 
        };
      } else if (maxCorrelation > 0.7) {
        return { 
          severity: "warning", 
          message: `Strong correlation with: ${correlatedFeatures.join(", ")}` 
        };
      } else {
        return { 
          severity: "info", 
          message: `Moderate correlation with: ${correlatedFeatures.join(", ")}` 
        };
      }
    } catch (error) {
      return { severity: "error", message: "Analysis error" };
    }
  };

  // Add function to analyze outlier severity
  const getOutlierSeverity = (feature) => {
    if (!outlierInfo || !outlierInfo.columnsWithOutliers) return { severity: "info", message: "" };
    
    try {
      // Find outlier information for this feature
      const featureOutliers = outlierInfo.columnsWithOutliers.find(
        item => item.column === feature
      );
      
      if (!featureOutliers) {
        return { severity: "success", message: "No outliers detected" };
      }

      const { outlierCount, outlierPercentage } = featureOutliers;
      
      // Determine severity based on percentage of outliers
      if (outlierPercentage > 10) {
        return { 
          severity: "error", 
          message: `Critical: ${outlierCount} outliers (${outlierPercentage.toFixed(1)}% of data)` 
        };
      } else if (outlierPercentage > 5) {
        return { 
          severity: "warning", 
          message: `High: ${outlierCount} outliers (${outlierPercentage.toFixed(1)}% of data)` 
        };
      } else {
        return { 
          severity: "info", 
          message: `${outlierCount} outliers (${outlierPercentage.toFixed(1)}% of data)` 
        };
      }
    } catch (error) {
      return { severity: "error", message: "Analysis error" };
    }
  };

  // Update useEffect to calculate severity for all features
  useEffect(() => {
    if (response && response.columns && histogram) {
      const severityMap = {};
      response.columns.forEach(feature => {
        severityMap[feature] = getFeatureSeverity(feature);
      });
      setFeatureSeverityMap(severityMap);
    }
  }, [response, histogram]);

  useEffect(() => {
    if (response && response.columns && histogram) {
      const severityMap = {};
      response.columns.forEach(feature => {
        severityMap[feature] = getMissingValuesSeverity(feature);
      });
      setMissingValuesSeverityMap(severityMap);
    }
  }, [response, histogram]);

  useEffect(() => {
    if (response && response.columns && response.columns.length > 0) {
      setSelectedDistributionFeature(response.columns[0]);
    }
  }, [response]);

  useEffect(() => {
    if (histogram && selectedDistributionFeature && histogram[selectedDistributionFeature]) {
      // console.log(`AdvancedDataQuality - Processing feature '${selectedDistributionFeature}'`);
      
      try {
        // Check if data exists
        const featureData = histogram[selectedDistributionFeature];
        // console.log(`AdvancedDataQuality - Feature data for '${selectedDistributionFeature}':`, {
        //   exists: !!featureData,
        //   isArray: Array.isArray(featureData),
        //   length: featureData ? featureData.length : 0,
        //   sample: featureData ? featureData.slice(0, 5) : []
        // });
        
        if (!Array.isArray(featureData) || featureData.length === 0) {
          // console.log(`AdvancedDataQuality - No data for feature '${selectedDistributionFeature}'`);
          setDistributionInfo({
            skewness: 0,
            kurtosis: 0,
            isNormal: false,
            dataType: 'empty'
          });
          return;
        }

        // Determine data type
        const data = featureData;
        // console.log(`AdvancedDataQuality - Data type for '${selectedDistributionFeature}':`, {
        //   isNumeric: data.every(d => typeof d === 'number' && !isNaN(d)),
        //   sample: data.slice(0, 5)
        // });

        if (!data.every(d => typeof d === 'number' && !isNaN(d))) {
          // console.log(`AdvancedDataQuality - Non-numeric feature '${selectedDistributionFeature}'`);
          setDistributionInfo({
            skewness: 0,
            kurtosis: 0,
            isNormal: false,
            dataType: 'categorical'
          });
          return;
        }

        // Process numeric data
        const numericData = data.filter(d => typeof d === 'number' && !isNaN(d));
        // console.log(`AdvancedDataQuality - Numeric data for '${selectedDistributionFeature}':`, {
        //   length: numericData.length,
        //   sample: numericData.slice(0, 5)
        // });

        if (numericData.length === 0) {
          // console.log(`AdvancedDataQuality - No numeric data for feature '${selectedDistributionFeature}'`);
          setDistributionInfo({
            skewness: 0,
            kurtosis: 0,
            isNormal: false,
            dataType: 'empty'
          });
          return;
        }

        // Check for constant values
        const isConstant = numericData.every(val => val === numericData[0]);
        if (isConstant) {
          // console.log(`AdvancedDataQuality - Constant value for feature '${selectedDistributionFeature}':`, data[0]);
          setDistributionInfo({
            skewness: 0,
            kurtosis: 0,
            isNormal: false,
            dataType: 'constant'
          });
          return;
        }

        // Calculate basic distribution properties for numeric data
        const mean = numericData.reduce((sum, val) => sum + val, 0) / numericData.length;
        
        // Calculate standard deviation
        const variance = numericData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericData.length;
        const stdDev = Math.sqrt(variance);
        const stdDevFixed = parseFloat(stdDev.toFixed(2));
        
        console.log(`AdvancedDataQuality - Basic statistics for '${selectedDistributionFeature}':`, {
          mean,
          stdDev: stdDevFixed,
          variance
        });
        
        // Prevent division by zero
        if (stdDev === 0) {
          // console.log(`AdvancedDataQuality - Zero standard deviation for feature '${selectedDistributionFeature}'`);
          setDistributionInfo({
            skewness: 0,
            kurtosis: 0,
            isNormal: false,
            dataType: 'constant'
          });
          return;
        }
        
        // Calculate skewness
        const skewness = numericData.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / numericData.length;
        
        // Calculate kurtosis
        const kurtosis = numericData.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / numericData.length - 3;
        
        // Determine if distribution is approximately normal
        const isNormal = Math.abs(skewness) < 0.5 && Math.abs(kurtosis) < 0.5;
        
        // console.log(`AdvancedDataQuality - Distribution metrics for '${selectedDistributionFeature}':`, {
        //   skewness,
        //   kurtosis,
        //   isNormal
        // });
        
        setDistributionInfo({
          skewness: parseFloat(skewness.toFixed(2)),
          kurtosis: parseFloat(kurtosis.toFixed(2)),
          isNormal,
          dataType: 'numeric'
        });
      } catch (error) {
        console.error(`AdvancedDataQuality - Error analyzing feature '${selectedDistributionFeature}':`, error);
        setDistributionInfo({
          skewness: 0,
          kurtosis: 0,
          isNormal: false,
          dataType: 'error'
        });
      }
    } else {
      // console.log(`AdvancedDataQuality - No histogram data for feature '${selectedDistributionFeature}'`);
    }
  }, [histogram, selectedDistributionFeature]);

  // New useEffect for correlation analysis
  useEffect(() => {
    // console.log('AdvancedDataQuality - Calculating correlations');
    
    if (!histogram || !response || !response.columns) {
      // console.log('AdvancedDataQuality - Missing data for correlation analysis');
      return;
    }
    
    try {
      // Filter to numerical columns only
      const numericalColumns = response.columns.filter(column => {
        if (!histogram[column]) return false;
        
        // Check if column has numeric data
        const numericCount = histogram[column].filter(val => 
          val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val)
        ).length;
        
        return numericCount > histogram[column].length * 0.5;
      });
      
      // console.log('AdvancedDataQuality - Numerical columns:', numericalColumns);
      
      if (numericalColumns.length < 2) {
        // console.log('AdvancedDataQuality - Not enough numerical columns for correlation analysis');
        setCorrelationInfo({
          highCorrelations: [],
          hasMulticollinearity: false
        });
        return;
      }
      
      // Calculate correlations between all numerical columns
      const highCorrelations = [];
      
      for (let i = 0; i < numericalColumns.length; i++) {
        const col1 = numericalColumns[i];
        
        // Convert column data to numeric
        const col1Data = histogram[col1]
          .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
          .map(val => parseFloat(val));
        
        if (col1Data.length === 0) continue;
        
        for (let j = i + 1; j < numericalColumns.length; j++) {
          const col2 = numericalColumns[j];
          
          // Convert column data to numeric
          const col2Data = histogram[col2]
            .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
            .map(val => parseFloat(val));
          
          if (col2Data.length === 0) continue;
          
          // Calculate correlation coefficient (Pearson)
          const correlation = calculateCorrelation(col1Data, col2Data);
          
          // Track high correlations (|r| > 0.7)
          if (Math.abs(correlation) > 0.7) {
            highCorrelations.push({
              feature1: col1,
              feature2: col2,
              correlation: correlation
            });
          }
        }
      }
      
      console.log('AdvancedDataQuality - High correlations:', highCorrelations);
      
      setCorrelationInfo({
        highCorrelations,
        hasMulticollinearity: highCorrelations.some(corr => Math.abs(corr.correlation) > 0.8)
      });
    } catch (error) {
      console.error('AdvancedDataQuality - Error in correlation analysis:', error);
      setCorrelationInfo({
        highCorrelations: [],
        hasMulticollinearity: false
      });
    }
  }, [histogram, response]);

  // Calculate correlations when data changes
  useEffect(() => {
    // ... existing code ...
  }, [histogram, response]);

  // Calculate outlier information when data changes
  useEffect(() => {
    // console.log('Calculating outlier information...');
    
    if (!histogram || !response || !response.columns) {
      // console.log('Missing data for outlier analysis');
      return;
    }
    
    try {
      // Find numerical columns
      const numericalColumns = response.columns.filter(column => {
        if (!histogram[column]) return false;
        
        // Check if column has numeric data
        const numericCount = histogram[column].filter(val => 
          val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val)
        ).length;
        
        return numericCount > histogram[column].length * 0.5;
      });
      
      // console.log(`Found ${numericalColumns.length} numerical columns for outlier analysis`);
      
      if (numericalColumns.length === 0) {
        setOutlierInfo({
          totalOutliers: 0,
          columnsWithOutliers: [],
          worstColumn: null
        });
        return;
      }
      
      // Calculate outliers for each column
      const columnsWithOutliersData = [];
      let totalOutlierCount = 0;
      
      numericalColumns.forEach(column => {
        // Convert column data to numeric
        const numericData = histogram[column]
          .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
          .map(val => parseFloat(val));
        
        if (numericData.length === 0) return;
        
        // Sort data for calculations
        const sortedData = [...numericData].sort((a, b) => a - b);
        
        // Calculate quartiles
        const q1Index = Math.floor(sortedData.length * 0.25);
        const q3Index = Math.floor(sortedData.length * 0.75);
        
        const q1 = sortedData[q1Index];
        const q3 = sortedData[q3Index];
        
        // Calculate IQR and whiskers
        const iqr = q3 - q1;
        const lowerWhisker = q1 - 1.5 * iqr;
        const upperWhisker = q3 + 1.5 * iqr;
        
        // Identify outliers
        const outliers = numericData.filter(val => val < lowerWhisker || val > upperWhisker);
        const outlierCount = outliers.length;
        const outlierPercentage = (outlierCount / numericData.length) * 100;
        
        if (outlierCount > 0) {
          columnsWithOutliersData.push({
            column,
            outlierCount,
            outlierPercentage
          });
          
          totalOutlierCount += outlierCount;
        }
      });
      
      // Sort columns by outlier count
      columnsWithOutliersData.sort((a, b) => b.outlierCount - a.outlierCount);
      
      // console.log('Outlier analysis results:', {
      //   totalOutliers: totalOutlierCount,
      //   columnsWithOutliers: columnsWithOutliersData.length,
      //   worstColumn: columnsWithOutliersData.length > 0 ? columnsWithOutliersData[0] : null
      // });
      
      setOutlierInfo({
        totalOutliers: totalOutlierCount,
        columnsWithOutliers: columnsWithOutliersData,
        worstColumn: columnsWithOutliersData.length > 0 ? columnsWithOutliersData[0] : null
      });
    } catch (error) {
      console.error('Error calculating outlier information:', error);
    }
  }, [histogram, response]);

  // Helper function to calculate Pearson correlation
  const calculateCorrelation = (x, y) => {
    if (x.length !== y.length || x.length === 0) {
      return 0;
    }
    
    // Calculate means
    const xMean = x.reduce((sum, val) => sum + val, 0) / x.length;
    const yMean = y.reduce((sum, val) => sum + val, 0) / y.length;
    
    // Calculate correlation coefficient
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;
    
    for (let i = 0; i < x.length; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }
    
    if (xDenominator === 0 || yDenominator === 0) {
      return 0;
    }
    
    return numerator / (Math.sqrt(xDenominator) * Math.sqrt(yDenominator));
  };

  // Update useEffect to calculate severity for correlations
  useEffect(() => {
    if (response && response.columns && correlationInfo) {
      const severityMap = {};
      response.columns.forEach(feature => {
        severityMap[feature] = getCorrelationSeverity(feature);
      });
      setCorrelationSeverityMap(severityMap);
    }
  }, [response, correlationInfo]);

  // Update useEffect to calculate severity for outliers
  useEffect(() => {
    if (response && response.columns && outlierInfo) {
      const severityMap = {};
      response.columns.forEach(feature => {
        severityMap[feature] = getOutlierSeverity(feature);
      });
      setOutlierSeverityMap(severityMap);
    }
  }, [response, outlierInfo]);

  // Update handlers for each analysis type
  const handleDistributionFeatureChange = (event) => {
    setSelectedDistributionFeature(event.target.value);
  };

  const handleMissingValuesFeatureChange = (event) => {
    setSelectedMissingValuesFeature(event.target.value);
  };

  const handleCorrelationFeatureChange = (event) => {
    setSelectedCorrelationFeature(event.target.value);
  };

  const handleOutlierFeatureChange = (event) => {
    setSelectedOutlierFeature(event.target.value);
  };

  // Remove old handlers
  // const handleFeatureChange = (event) => {
  //   setSelectedFeature(event.target.value);
  // };
  // const handleViewChange = (event) => {
  //   setSelectedView(event.target.value);
  // };

  // New useEffect to generate data quality summary
  useEffect(() => {
    if (!histogram || !response || !response.columns) {
      return;
    }
    
    try {
      // console.log('Generating data quality summary...');
      
      // Get numerical columns
      const numericalColumns = response.columns.filter(column => {
        if (!histogram[column]) return false;
        
        const numericCount = histogram[column].filter(val => 
          val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val)
        ).length;
        
        return numericCount > histogram[column].length * 0.5;
      });
      
      // Calculate missing values per column
      const missingValuesPerColumn = [];
      let totalMissingValues = 0;
      let totalCells = response.rows * response.columnsLength;
      
      response.columns.forEach(column => {
        const columnData = histogram[column];
        if (!columnData) return;
        
        const missingCount = columnData.filter(val => 
          val === null || val === undefined || val === '' || (typeof val === 'string' && val.trim() === '')
        ).length;
        
        if (missingCount > 0) {
          const missingPercentage = (missingCount / response.rows) * 100;
          missingValuesPerColumn.push({
            column,
            missingCount,
            missingPercentage
          });
          totalMissingValues += missingCount;
        }
      });
      
      // Sort by missing percentage (descending)
      missingValuesPerColumn.sort((a, b) => b.missingPercentage - a.missingPercentage);
      
      // Update missing values info state
      setMissingValuesInfo({
        totalMissingValues,
        featuresWithMissing: missingValuesPerColumn,
        worstFeature: missingValuesPerColumn.length > 0 ? missingValuesPerColumn[0] : null,
        percentageOfDataMissing: (totalMissingValues / totalCells) * 100
      });
      
      // Calculate distribution information across all features
      const skewedFeatures = [];
      const normalFeatures = [];
      const constantFeatures = [];
      const categoricalFeatures = [];
      
      numericalColumns.forEach(column => {
        // Convert column data to numeric
        const numericData = histogram[column]
          .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
          .map(val => parseFloat(val));
        
        if (numericData.length === 0) {
          return;
        }
        
        // Check if all values are the same
        const allSame = numericData.every(val => val === numericData[0]);
        if (allSame) {
          constantFeatures.push({
            column,
            value: numericData[0]
          });
          return;
        }
        
        // Calculate mean
        const mean = numericData.reduce((sum, val) => sum + val, 0) / numericData.length;
        
        // Calculate standard deviation
        const variance = numericData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericData.length;
        const stdDev = Math.sqrt(variance);
        
        // Skip if standard deviation is zero
        if (stdDev === 0) {
          constantFeatures.push({
            column,
            value: mean
          });
          return;
        }
        
        // Calculate skewness
        const skewness = numericData.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / numericData.length;
        
        // Calculate kurtosis
        const kurtosis = numericData.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / numericData.length - 3;
        
        // Determine if distribution is approximately normal
        const isNormal = Math.abs(skewness) < 0.5 && Math.abs(kurtosis) < 0.5;
        
        if (isNormal) {
          normalFeatures.push({
            column,
            skewness,
            kurtosis
          });
        } else if (Math.abs(skewness) > 1.0) {
          skewedFeatures.push({
            column,
            skewness,
            kurtosis,
            direction: skewness > 0 ? 'right' : 'left'
          });
        } else {
          // Slightly skewed but not enough to be concerning
          normalFeatures.push({
            column,
            skewness,
            kurtosis
          });
        }
      });
      
      // Calculate percentage of skewed features
      const totalNumericalFeatures = numericalColumns.length;
      const percentageSkewed = totalNumericalFeatures > 0 ? 
        (skewedFeatures.length / totalNumericalFeatures) * 100 : 0;
      
      // Update overall distribution info state
      setOverallDistributionInfo({
        skewedFeatures,
        normalFeatures,
        constantFeatures,
        categoricalFeatures,
        percentageSkewed
      });
      
      // Generate natural language summary
      let summary = "";
      
      // Overall dataset size
      summary += `Your dataset contains ${response.rows} rows and ${response.columnsLength} columns. `;
      
      // Missing values
      if (missingValuesInfo.totalMissingValues > 0) {
        summary += `${missingValuesInfo.featuresWithMissing.length} features have missing values, affecting ${missingValuesInfo.totalMissingValues} cells (${missingValuesInfo.percentageOfDataMissing.toFixed(1)}% of all data). `;
        
        if (missingValuesInfo.featuresWithMissing.length > 0) {
          if (missingValuesInfo.featuresWithMissing.length > 3) {
            summary += `${missingValuesInfo.featuresWithMissing.length} features have missing values, with the worst being "${missingValuesInfo.worstFeature.column}" (${missingValuesInfo.worstFeature.missingPercentage.toFixed(1)}% missing). `;
          } else {
            const featuresList = missingValuesInfo.featuresWithMissing
              .slice(0, 3)
              .map(item => `"${item.column}" (${item.missingPercentage.toFixed(1)}%)`)
              .join(", ");
            
            summary += `Features with missing values: ${featuresList}. `;
          }
        }
      } else {
        summary += "Your dataset has no missing values, which is excellent! ";
      }
      
      // Correlations
      if (correlationInfo.highCorrelations.length > 0) {
        summary += `Found ${correlationInfo.highCorrelations.length} pairs of highly correlated features. `;
        
        if (correlationInfo.hasMulticollinearity) {
          summary += "Your dataset exhibits multicollinearity, which may affect model stability. ";
        }
        
        if (correlationInfo.highCorrelations.length <= 3) {
          const correlationsList = correlationInfo.highCorrelations
            .slice(0, 3)
            .map(corr => `"${corr.feature1}" and "${corr.feature2}" (${corr.correlation.toFixed(2)})`)
            .join(", ");
          
          summary += `Highly correlated pairs: ${correlationsList}. `;
        }
      } else {
        summary += "Your features appear to be independent, which is ideal for modeling. ";
      }
      
      // Outliers
      if (outlierInfo.totalOutliers > 0) {
        summary += `Detected ${outlierInfo.totalOutliers} outliers across ${outlierInfo.columnsWithOutliers.length} features. `;
        
        if (outlierInfo.worstColumn) {
          summary += `"${outlierInfo.worstColumn.column}" has the most outliers (${outlierInfo.worstColumn.outlierCount} points, ${outlierInfo.worstColumn.outlierPercentage.toFixed(1)}% of data). `;
        }
      } else {
        summary += "No significant outliers detected in your numerical features. ";
      }
      
      // Distribution characteristics
      const skewedColumns = numericalColumns.filter(column => {
        const numericData = histogram[column]
          .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
          .map(val => parseFloat(val));
        
        if (numericData.length === 0) return false;
        
        const mean = numericData.reduce((sum, val) => sum + val, 0) / numericData.length;
        const variance = numericData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericData.length;
        const stdDev = Math.sqrt(variance);
        
        if (stdDev === 0) return false;
        
        const skewness = numericData.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / numericData.length;
        
        return Math.abs(skewness) > 1.5;
      });
      
      if (skewedColumns.length > 0) {
        summary += `${skewedColumns.length} numerical features have skewed distributions that may benefit from transformation. `;
      }
      
      // Generate recommendations based on analysis
      const recommendations = [];
      
      // Missing values recommendations
      missingValuesPerColumn.forEach(item => {
        if (item.missingPercentage > 50) {
          recommendations.push({
            type: "missing_values",
            severity: "high",
            column: item.column,
            missingPercentage: item.missingPercentage,
            message: `Consider dropping "${item.column}" as it has ${item.missingPercentage.toFixed(1)}% missing values`
          });
        } else if (item.missingPercentage > 20) {
          recommendations.push({
            type: "missing_values",
            severity: "medium",
            column: item.column,
            missingPercentage: item.missingPercentage,
            message: `"${item.column}" has ${item.missingPercentage.toFixed(1)}% missing values - consider imputation`
          });
        }
      });

      // Constant values recommendations
      constantFeatures.forEach(item => {
        recommendations.push({
          type: "constant_values",
          severity: "high",
          column: item.column,
          value: item.value,
          message: `"${item.column}" has constant value ${item.value} - consider removing it`
        });
      });

      // Correlation recommendations
      correlationInfo.highCorrelations.forEach(item => {
        if (Math.abs(item.correlation) > 0.9) {
          // For highly correlated pairs, recommend dropping the one with more missing values
          const feature1Missing = missingValuesPerColumn.find(mv => mv.column === item.feature1)?.missingPercentage || 0;
          const feature2Missing = missingValuesPerColumn.find(mv => mv.column === item.feature2)?.missingPercentage || 0;
          const featureToDrop = feature1Missing > feature2Missing ? item.feature1 : item.feature2;
          const featureToKeep = feature1Missing > feature2Missing ? item.feature2 : item.feature1;
          
          recommendations.push({
            type: "correlation",
            severity: "high",
            column: featureToDrop,
            correlatedWith: featureToKeep,
            correlationValue: item.correlation,
            message: `Consider dropping "${featureToDrop}" as it's highly correlated with "${featureToKeep}"`
          });
        }
      });

      // Outlier recommendations
      outlierInfo.columnsWithOutliers.forEach(item => {
        if (item.outlierPercentage > 30) {
          recommendations.push({
            type: "outliers",
            severity: "high",
            column: item.column,
            outlierCount: item.outlierCount,
            outlierPercentage: item.outlierPercentage,
            message: `"${item.column}" has ${item.outlierPercentage.toFixed(1)}% outliers - consider treatment or removal`
          });
        } else if (item.outlierPercentage > 15) {
          recommendations.push({
            type: "outliers",
            severity: "medium",
            column: item.column,
            outlierCount: item.outlierCount,
            outlierPercentage: item.outlierPercentage,
            message: `"${item.column}" has ${item.outlierPercentage.toFixed(1)}% outliers - consider treatment`
          });
        }
      });

      // Skewness recommendations
      skewedFeatures.forEach(item => {
        if (Math.abs(item.skewness) > 2) {
          recommendations.push({
            type: "skewed",
            severity: "medium",
            column: item.column,
            skewness: item.skewness,
            message: `"${item.column}" is highly skewed (${item.skewness.toFixed(2)}) - consider transformation`
          });
        }
      });

      // Group recommendations by type
      const groupedRecommendations = {
        missing_values: recommendations.filter(rec => rec.type === "missing_values"),
        constant_values: recommendations.filter(rec => rec.type === "constant_values"),
        correlation: recommendations.filter(rec => rec.type === "correlation"),
        outliers: recommendations.filter(rec => rec.type === "outliers"),
        skewed: recommendations.filter(rec => rec.type === "skewed")
      };
      
      // Determine overall data quality
      const highSeverityIssues = recommendations.filter(rec => rec.severity === "high").length;
      const mediumSeverityIssues = recommendations.filter(rec => rec.severity === "medium").length;
      
      let overallQuality = "medium";
      if (highSeverityIssues === 0 && mediumSeverityIssues <= 1) {
        overallQuality = "good";
        summary += "Overall, your dataset appears to be of good quality with few issues that need addressing.";
      } else if (highSeverityIssues >= 3 || (highSeverityIssues >= 1 && mediumSeverityIssues >= 3)) {
        overallQuality = "poor";
        summary += "Overall, your dataset has several quality issues that should be addressed before modeling.";
      } else {
        summary += "Overall, your dataset has some quality issues that should be addressed, but is generally workable.";
      }

      // Update state with summary and recommendations
      setDataQualitySummary({
        summary,
        recommendations,
        groupedRecommendations,
        overallQuality
      });
      
      // console.log('Data quality summary generated:', { summary, recommendations, groupedRecommendations, overallQuality });
      
      // Calculate missing values per column
      // ... existing code ...
      
    } catch (error) {
      console.error("Error in data quality summary calculation:", error);
      setDataQualitySummary({
        summary: "An error occurred while analyzing your dataset.",
        recommendations: [],
        groupedRecommendations: {},
        overallQuality: "medium"
      });
    }
  }, [histogram, response, correlationInfo, outlierInfo, missingValuesInfo]);

  // Function to get overall distribution alert info
  const getOverallDistributionAlertInfo = () => {
    if (!histogram || !response || !response.columns) {
      return {
        severity: "info",
        message: "Distribution analysis not available. Please wait for data to load."
      };
    }
    
    const { skewedFeatures, normalFeatures, constantFeatures } = overallDistributionInfo;
    const totalNumericalFeatures = skewedFeatures.length + normalFeatures.length + constantFeatures.length;
    
    if (totalNumericalFeatures === 0) {
      return {
        severity: "info",
        message: "No numerical features detected for distribution analysis."
      };
    }
    
    if (constantFeatures.length > 0) {
      return {
        severity: "warning",
        message: `${constantFeatures.length} features have constant values, which provide no information for modeling.`
      };
    }
    
    if (skewedFeatures.length > 0) {
      // Find the feature with the most extreme skewness
      const worstSkewedFeature = [...skewedFeatures].sort((a, b) => Math.abs(b.skewness) - Math.abs(a.skewness))[0];
      
      if (skewedFeatures.length > totalNumericalFeatures * 0.5) {
        return {
          severity: "warning",
          message: `${skewedFeatures.length} features (${Math.round(overallDistributionInfo.percentageSkewed)}% of numerical) have skewed distributions.`,
          worstFeature: worstSkewedFeature
        };
      }
      
      return {
        severity: "info",
        message: `${skewedFeatures.length} features have skewed distributions that may benefit from transformation.`,
        worstFeature: worstSkewedFeature
      };
    }
    
    return {
      severity: "success",
      message: `Most features have normal distributions, which is ideal for many machine learning algorithms.`
    };
  };

  if (!response) return null;

  // Log histogram data for debugging
  // console.log('AdvancedDataQuality - Rendering with histogram data:', {
  //   exists: !!histogram,
  //   keys: histogram ? Object.keys(histogram).slice(0, 5) : [],
  //   selectedFeature,
  //   selectedView
  // });

  const getDistributionAlertInfo = () => {
    if (!histogram || !selectedDistributionFeature || !histogram[selectedDistributionFeature]) {
      return {
        severity: "info",
        message: "Select a numerical feature to analyze its distribution."
      };
    }

    const { skewness, kurtosis, isNormal, dataType } = distributionInfo;
    
    if (dataType === 'empty') {
      return {
        severity: "warning",
        message: "No data available for this feature."
      };
    }
    
    if (dataType === 'categorical') {
      return {
        severity: "info",
        message: "This appears to be a categorical feature. Distribution analysis works best with numerical data."
      };
    }
    
    if (dataType === 'constant') {
      return {
        severity: "warning",
        message: "This feature has constant values, which provides no information for modeling."
      };
    }
    
    if (dataType === 'error') {
      return {
        severity: "error",
        message: "An error occurred while analyzing this feature's distribution."
      };
    }
    
    if (isNormal) {
      return {
        severity: "success",
        message: `"${selectedDistributionFeature}" has a normal distribution (skewness: ${skewness.toFixed(2)}, kurtosis: ${kurtosis.toFixed(2)}), which is ideal for many machine learning algorithms.`
      };
    } else if (Math.abs(skewness) > 1.5) {
      const transformationSuggestion = skewness > 0 
        ? "Consider applying a log or square root transformation." 
        : "Consider applying a power transformation.";
      
      return {
        severity: "warning",
        message: `"${selectedDistributionFeature}" has a ${skewness > 0 ? 'right' : 'left'}-skewed distribution (skewness: ${skewness.toFixed(2)}). ${transformationSuggestion}`
      };
    } else {
      return {
        severity: "info",
        message: `"${selectedDistributionFeature}" has a slightly skewed distribution (skewness: ${skewness.toFixed(2)}). It may benefit from normalization.`
      };
    }
  };

  // Function to get correlation alert info
  const getCorrelationAlertInfo = () => {
    if (!histogram || !selectedCorrelationFeature) {
      return {
        severity: "info",
        message: "Select features to analyze correlations between variables. Correlation measures how two features move in relation to each other."
      };
    }

    if (selectedCorrelationFeature !== 'all') {
      // For a specific feature
      const featureCorrelations = correlationInfo.highCorrelations.filter(
        corr => corr.feature1 === selectedCorrelationFeature || corr.feature2 === selectedCorrelationFeature
      );
      
      if (featureCorrelations.length === 0) {
        return {
          severity: "info",
          message: `No strong correlations found for "${selectedCorrelationFeature}" with other features. This feature likely provides unique information to your model.`
        };
      } else {
        const strongestCorr = featureCorrelations.reduce(
          (prev, curr) => Math.abs(curr.correlation) > Math.abs(prev.correlation) ? curr : prev, 
          featureCorrelations[0]
        );
        
        const otherFeature = strongestCorr.feature1 === selectedCorrelationFeature ? 
          strongestCorr.feature2 : strongestCorr.feature1;
        
        const corrValue = strongestCorr.correlation.toFixed(2);
        const direction = strongestCorr.correlation > 0 ? "positive" : "negative";
        const explanation = strongestCorr.correlation > 0 
          ? "they increase together" 
          : "one increases as the other decreases";
        
        return {
          severity: Math.abs(strongestCorr.correlation) > 0.8 ? "warning" : "info",
          message: `"${selectedCorrelationFeature}" has a strong ${direction} correlation (${corrValue}) with "${otherFeature}" - meaning ${explanation}. ${Math.abs(strongestCorr.correlation) > 0.8 ? "Consider removing one of these features to avoid redundancy." : ""}`
        };
      }
    } else {
      // For all features
      if (correlationInfo.highCorrelations.length === 0) {
        return {
          severity: "success",
          message: "No multicollinearity detected. Your features appear to be independent, which is ideal for most machine learning models."
        };
      } else if (correlationInfo.highCorrelations.length > 3) {
        return {
          severity: "warning",
          message: `Found ${correlationInfo.highCorrelations.length} pairs of highly correlated features. High correlation (multicollinearity) can make models unstable. Consider removing redundant variables.`
        };
      } else {
        const pairs = correlationInfo.highCorrelations
          .slice(0, 2)
          .map(corr => {
            const direction = corr.correlation > 0 ? "positive" : "negative";
            return `"${corr.feature1}" & "${corr.feature2}" (${corr.correlation.toFixed(2)}, ${direction})`;
          })
          .join(", ");
          
        return {
          severity: "info",
          message: `Correlated pairs: ${pairs}${correlationInfo.highCorrelations.length > 2 ? ", and more..." : ""}. Highly correlated features may contain redundant information.`
        };
      }
    }
  };

  // Function to get outlier alert info
  const getOutlierAlertInfo = () => {
    if (!histogram || !selectedOutlierFeature) {
      return {
        severity: "info",
        message: "Select features to analyze potential outliers in your dataset. Outliers are extreme values that deviate significantly from other observations."
      };
    }

    if (selectedOutlierFeature !== 'all') {
      // For a specific feature
      const featureOutliers = outlierInfo.columnsWithOutliers.find(
        item => item.column === selectedOutlierFeature
      );
      
      if (!featureOutliers) {
        return {
          severity: "success",
          message: `No outliers detected in "${selectedOutlierFeature}". The data appears to be within expected ranges.`
        };
      } else {
        return {
          severity: "warning",
          message: `Found ${featureOutliers.outlierCount} outliers in "${selectedOutlierFeature}" (${featureOutliers.outlierPercentage.toFixed(1)}% of data). Outliers can significantly impact model performance and should be addressed.`
        };
      }
    } else {
      // For all features
      if (outlierInfo.totalOutliers === 0) {
        return {
          severity: "success",
          message: "No outliers detected in the analyzed columns. Your data appears to be within expected ranges."
        };
      } else if (outlierInfo.columnsWithOutliers.length > 3) {
        return {
          severity: "warning",
          message: `Found outliers in ${outlierInfo.columnsWithOutliers.length} columns (${outlierInfo.totalOutliers} total outliers). Consider using robust models or addressing these outliers.`
        };
      } else {
        const columnsList = outlierInfo.columnsWithOutliers
          .slice(0, 2)
          .map(item => `"${item.column}" (${item.outlierCount} outliers)`)
          .join(", ");
          
        return {
          severity: "info",
          message: `Outliers detected in: ${columnsList}${outlierInfo.columnsWithOutliers.length > 2 ? ", and more..." : ""}. Outliers may indicate data entry errors or genuinely extreme values.`
        };
      }
    }
  };

  // Function to get missing values alert info
  const getMissingValuesAlertInfo = () => {
    if (!missingValuesInfo.featuresWithMissing || missingValuesInfo.featuresWithMissing.length === 0) {
      return {
        severity: "success",
        message: "No missing values detected in your dataset. This is ideal for most machine learning models."
      };
    }
    
    // High severity if more than 5% of total data is missing or any feature has >50% missing
    const hasSeverelyMissingFeature = missingValuesInfo.featuresWithMissing.some(item => item.missingPercentage > 50);
    const highMissingPercentage = missingValuesInfo.percentageOfDataMissing > 5;
    
    if (hasSeverelyMissingFeature || highMissingPercentage) {
      let message = `${missingValuesInfo.featuresWithMissing.length} features have missing values, affecting ${missingValuesInfo.totalMissingValues} cells (${missingValuesInfo.percentageOfDataMissing.toFixed(1)}% of all data). `;
      
      if (hasSeverelyMissingFeature) {
        const severelyMissingFeatures = missingValuesInfo.featuresWithMissing
          .filter(item => item.missingPercentage > 50)
          .slice(0, 2)
          .map(item => `"${item.column}" (${item.missingPercentage.toFixed(1)}%)`)
          .join(", ");
          
        message += `Features with critical missing values: ${severelyMissingFeatures}${missingValuesInfo.featuresWithMissing.filter(item => item.missingPercentage > 50).length > 2 ? ", and more..." : ""}. Consider dropping these features.`;
      } else {
        message += `Worst feature: "${missingValuesInfo.worstFeature.column}" with ${missingValuesInfo.worstFeature.missingPercentage.toFixed(1)}% missing. Consider imputation strategies.`;
      }
      
      return {
        severity: "warning",
        message
      };
    }
    
    // Medium severity if 1-5% of data is missing
    if (missingValuesInfo.percentageOfDataMissing > 1) {
      return {
        severity: "info",
        message: `${missingValuesInfo.featuresWithMissing.length} features have missing values (${missingValuesInfo.percentageOfDataMissing.toFixed(1)}% of all data). Consider using imputation techniques for these features.`
      };
    }
    
    // Low severity if less than 1% of data is missing
    return {
      severity: "success",
      message: `Only ${missingValuesInfo.percentageOfDataMissing.toFixed(2)}% of data is missing across ${missingValuesInfo.featuresWithMissing.length} features. This should have minimal impact on model performance.`
    };
  };

  // Get alerts for different aspects of data quality
  const missingValuesAlert = getMissingValuesAlertInfo();
  const outlierAlert = getOutlierAlertInfo();
  const correlationAlert = getCorrelationAlertInfo();
  const distributionAlert = getOverallDistributionAlertInfo();
  
  return (
    <Paper sx={{ p: 3, borderRadius: "15px", mb: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1E293B" }}>
          Data Quality Summary
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#64748B" }}>
          {dataQualitySummary.summary || "Analyzing your dataset to identify quality issues..."}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Tooltip title={`${overallDistributionInfo.skewedFeatures.length} skewed features, ${overallDistributionInfo.normalFeatures.length} normal features, ${overallDistributionInfo.constantFeatures.length} constant features`} arrow placement="top">
              <Alert 
                severity={distributionAlert.severity} 
                icon={distributionAlert.severity === "warning" ? <WarningAmber /> : 
                      distributionAlert.severity === "success" ? <CheckIcon /> : <Info />}
                sx={{ mb: 1, cursor: 'pointer' }}
              >
                <Typography variant="subtitle2">
                  Distribution Analysis: {distributionAlert.message}
                </Typography>
                {distributionAlert.worstFeature && (
                  <Typography variant="caption" sx={{ display: 'block', color: '#64748B' }}>
                    Worst feature: {distributionAlert.worstFeature.column} (skewness: {distributionAlert.worstFeature.skewness.toFixed(2)})
                  </Typography>
                )}
              </Alert>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={6}>
            <Tooltip 
              title={
                missingValuesInfo.featuresWithMissing.length > 0 
                  ? `Features with missing values: ${missingValuesInfo.featuresWithMissing.slice(0, 5).map(item => `${item.column} (${item.missingPercentage.toFixed(1)}%)`).join(', ')}${missingValuesInfo.featuresWithMissing.length > 5 ? '...' : ''}`
                  : "No missing values detected"
              } 
              arrow 
              placement="top"
            >
              <Alert 
                severity={missingValuesAlert.severity} 
                icon={missingValuesAlert.severity === "warning" ? <WarningAmber /> : 
                      missingValuesAlert.severity === "success" ? <CheckIcon /> : <Info />}
                sx={{ mb: 1, cursor: 'pointer' }}
              >
                <Typography variant="subtitle2">
                  Missing Values: {missingValuesInfo.totalMissingValues > 0 ? 
                    `${missingValuesInfo.featuresWithMissing.length} features affected (${missingValuesInfo.percentageOfDataMissing.toFixed(1)}% of data)` : 
                    "None detected"}
                </Typography>
                {missingValuesInfo.totalMissingValues > 0 && missingValuesInfo.worstFeature && (
                  <Typography variant="caption" sx={{ display: 'block', color: '#64748B' }}>
                    Worst feature: {missingValuesInfo.worstFeature.column} ({missingValuesInfo.worstFeature.missingPercentage.toFixed(1)}% missing)
                  </Typography>
                )}
              </Alert>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={6}>
            <Tooltip 
              title={
                outlierInfo.columnsWithOutliers.length > 0 
                  ? `Features with outliers: ${outlierInfo.columnsWithOutliers.slice(0, 5).map(item => `${item.column} (${item.outlierPercentage.toFixed(1)}%)`).join(', ')}${outlierInfo.columnsWithOutliers.length > 5 ? '...' : ''}`
                  : "No outliers detected"
              } 
              arrow 
              placement="top"
            >
              <Alert 
                severity={outlierInfo.totalOutliers > 0 ? "warning" : "success"} 
                icon={outlierInfo.totalOutliers > 0 ? <WarningAmber /> : <CheckIcon />}
                sx={{ mb: 1, cursor: 'pointer' }}
              >
                <Typography variant="subtitle2">
                  Outliers: {outlierInfo.totalOutliers} detected in {outlierInfo.columnsWithOutliers.length} features
                  {outlierInfo.worstColumn && ` (Worst: "${outlierInfo.worstColumn.column}")`}
                </Typography>
              </Alert>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={6}>
            <Tooltip 
              title={
                correlationInfo.highCorrelations.length > 0 
                  ? `Highly correlated pairs: ${correlationInfo.highCorrelations.slice(0, 3).map(item => `${item.feature1}-${item.feature2} (${item.correlation.toFixed(2)})`).join(', ')}${correlationInfo.highCorrelations.length > 3 ? '...' : ''}`
                  : "No high correlations detected"
              } 
              arrow 
              placement="top"
            >
              <Alert 
                severity={correlationInfo.hasMulticollinearity ? "warning" : "success"} 
                icon={correlationInfo.hasMulticollinearity ? <WarningAmber /> : <CheckIcon />}
                sx={{ mb: 1, cursor: 'pointer' }}
              >
                <Typography variant="subtitle2">
                  Correlations: {correlationInfo.highCorrelations.length} highly correlated pairs
                  {correlationInfo.hasMulticollinearity && " (Multicollinearity detected)"}
                </Typography>
              </Alert>
            </Tooltip>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
        <Box sx={{ mb: 2, mt: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'SF Pro Display', 
                    fontWeight: 600,
                    color: '#1a2027',
                    mb: 1
                  }}
                >
                  Recommended Actions
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'SF Pro Text',
                    color: '#64748B',
                    lineHeight: 1.5
                  }}
                >
                  Based on our analysis, here are suggested steps to improve your dataset quality.
                  Each tab shows different types of issues and recommended solutions.
                </Typography>
              </Box>
          
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={selectedTab} 
                onChange={(e, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    minHeight: '48px',
                    color: '#64748B',
                    '&.Mui-selected': {
                      color: '#2563EB',
                    }
                  }
                }}
              >
                {dataQualitySummary.groupedRecommendations?.missing_values?.length > 0 && (
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DataUsage sx={{ fontSize: 20 }} />
                        <span>Missing Values</span>
                        <Chip 
                          label={dataQualitySummary.groupedRecommendations.missing_values.length} 
                          size="small"
                          sx={{ 
                            ml: 1,
                            height: 20,
                            '& .MuiChip-label': { px: 1, fontSize: '0.75rem' }
                          }}
                        />
                      </Box>
                    } 
                    value="missing_values" 
                  />
                )}
                {dataQualitySummary.groupedRecommendations?.constant_values?.length > 0 && (
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Category sx={{ fontSize: 20 }} />
                        <span>Constant Values</span>
                        <Chip 
                          label={dataQualitySummary.groupedRecommendations.constant_values.length} 
                          size="small"
                          sx={{ 
                            ml: 1,
                            height: 20,
                            '& .MuiChip-label': { px: 1, fontSize: '0.75rem' }
                          }}
                        />
                      </Box>
                    } 
                    value="constant_values" 
                  />
                )}
                {dataQualitySummary.groupedRecommendations?.correlation?.length > 0 && (
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CompareArrows sx={{ fontSize: 20 }} />
                        <span>Correlations</span>
                        <Chip 
                          label={dataQualitySummary.groupedRecommendations.correlation.length} 
                          size="small"
                          sx={{ 
                            ml: 1,
                            height: 20,
                            '& .MuiChip-label': { px: 1, fontSize: '0.75rem' }
                          }}
                        />
                      </Box>
                    } 
                    value="correlation" 
                  />
                )}
                {dataQualitySummary.groupedRecommendations?.outliers?.length > 0 && (
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ErrorOutline sx={{ fontSize: 20 }} />
                        <span>Outliers</span>
                        <Chip 
                          label={dataQualitySummary.groupedRecommendations.outliers.length} 
                          size="small"
                          sx={{ 
                            ml: 1,
                            height: 20,
                            '& .MuiChip-label': { px: 1, fontSize: '0.75rem' }
                          }}
                        />
                      </Box>
                    } 
                    value="outliers" 
                  />
                )}
                {dataQualitySummary.groupedRecommendations?.skewed?.length > 0 && (
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingDown sx={{ fontSize: 20 }} />
                        <span>Skewed Distributions</span>
                        <Chip 
                          label={dataQualitySummary.groupedRecommendations.skewed.length} 
                          size="small"
                          sx={{ 
                            ml: 1,
                            height: 20,
                            '& .MuiChip-label': { px: 1, fontSize: '0.75rem' }
                          }}
                        />
                      </Box>
                    } 
                    value="skewed" 
                  />
                )}
              </Tabs>
            </Box>

            {/* Tab Panels */}
            {selectedTab === 'missing_values' && dataQualitySummary.groupedRecommendations?.missing_values?.length > 0 && (
              <Box sx={{ 
                height: '400px', // Fixed height to show ~1.5 cards
                overflowY: 'auto',
                // Custom scrollbar styling
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#94a3b8',
                  },
                },
                // Add padding to account for scrollbar
                pr: 1,
                // Add mask for smooth fade at bottom
                maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)'
              }}>
                {/* Existing Missing Values Card Content */}
                <MuiCard 
                  sx={{ 
                    mb: 2.5,
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      {dataQualitySummary.groupedRecommendations.missing_values.map((rec, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 2,
                            bgcolor: rec.severity === 'high' ? '#fff1f0' : '#fff8f0',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: rec.severity === 'high' ? '#ffd7d5' : '#ffe4c4'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: rec.severity === 'high' ? '#c62828' : '#ed6c02'
                              }}
                            >
                              {rec.column}
                            </Typography>
                            <Box 
                              sx={{ 
                                px: 1.5,
                                py: 0.5,
                                bgcolor: rec.severity === 'high' ? '#ffebee' : '#fff3e0',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: rec.severity === 'high' ? '#ffcdd2' : '#ffe0b2'
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontFamily: 'SF Pro Text',
                                  fontWeight: 500,
                                  color: rec.severity === 'high' ? '#c62828' : '#ed6c02'
                                }}
                              >
                                {rec.missingPercentage.toFixed(1)}% missing
                              </Typography>
                            </Box>
                          </Box>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'SF Pro Text',
                              color: '#64748B',
                              mb: 1.5
                            }}
                          >
                            {rec.message}
                          </Typography>

                          <Box sx={{ mt: 2 }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: '#475569',
                                display: 'block',
                                mb: 1
                              }}
                            >
                              Suggested Solutions:
                            </Typography>
                            <Stack spacing={1}>
                              {rec.severity === 'high' ? (
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DeleteOutline sx={{ fontSize: 16, color: '#64748B' }} />
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontFamily: 'SF Pro Text',
                                        color: '#64748B'
                                      }}
                                    >
                                      Consider removing this feature if not critical
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DataUsage sx={{ fontSize: 16, color: '#64748B' }} />
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontFamily: 'SF Pro Text',
                                        color: '#64748B'
                                      }}
                                    >
                                      Collect more data for this feature if possible
                                    </Typography>
                                  </Box>
                                </>
                              ) : (
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Functions sx={{ fontSize: 16, color: '#64748B' }} />
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontFamily: 'SF Pro Text',
                                        color: '#64748B'
                                      }}
                                    >
                                      Use mean/median imputation for numerical data
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Category sx={{ fontSize: 16, color: '#64748B' }} />
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontFamily: 'SF Pro Text',
                                        color: '#64748B'
                                      }}
                                    >
                                      Use mode/most frequent value for categorical data
                                    </Typography>
                                  </Box>
                                </>
                              )}
                            </Stack>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </MuiCard>
              </Box>
            )}

            {selectedTab === 'constant_values' && dataQualitySummary.groupedRecommendations?.constant_values?.length > 0 && (
              <Box sx={{ 
                height: '400px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#94a3b8',
                  },
                },
                pr: 1,
                maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)'
              }}>
                {/* Existing Constant Values Card Content */}
                <MuiCard sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <PriorityHigh sx={{ color: '#e53935', mr: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#e53935' }}>
                        Features with Constant Values
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1.5, color: '#64748B' }}>
                      These features have only one unique value and provide no information for prediction.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {dataQualitySummary.groupedRecommendations.constant_values.map((rec, idx) => (
                        <Chip 
                          key={idx}
                          label={rec.column}
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </MuiCard>
              </Box>
            )}

            {selectedTab === 'correlation' && dataQualitySummary.groupedRecommendations?.correlation?.length > 0 && (
              <Box sx={{ 
                height: '400px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#94a3b8',
                  },
                },
                pr: 1,
                maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)'
              }}>
                {/* Existing Correlation Card Content */}
                <MuiCard 
                  sx={{ 
                    mb: 2.5,
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CompareArrows sx={{ color: '#fb8c00', mr: 1.5, fontSize: 24 }} />
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontFamily: 'SF Pro Display',
                            fontWeight: 600,
                            color: '#fb8c00',
                            mb: 0.5
                          }}
                        >
                          High Correlations Detected
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'SF Pro Text',
                            color: '#64748B'
                          }}
                        >
                          Some features are strongly related to each other
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={2}>
                      {dataQualitySummary.groupedRecommendations.correlation.map((rec, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 2,
                            bgcolor: '#fff8f0',
                            borderRadius: '8px',
                            border: '1px solid #ffe0b2'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: '#e65100'
                              }}
                            >
                              {rec.column}
                            </Typography>
                            <ArrowForward sx={{ color: '#64748B', fontSize: 16 }} />
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: '#e65100'
                              }}
                            >
                              {rec.correlatedWith}
                            </Typography>
                            <Box 
                              sx={{ 
                                ml: 'auto',
                                px: 1.5,
                                py: 0.5,
                                bgcolor: '#fff3e0',
                                borderRadius: '12px',
                                border: '1px solid #ffe0b2'
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontFamily: 'SF Pro Text',
                                  fontWeight: 500,
                                  color: '#e65100'
                                }}
                              >
                                {Math.abs(rec.correlationValue).toFixed(2)} correlation
                              </Typography>
                            </Box>
                          </Box>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'SF Pro Text',
                              color: '#64748B',
                              mb: 1.5
                            }}
                          >
                            {rec.message}
                          </Typography>

                          <Box sx={{ mt: 2 }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: '#475569',
                                display: 'block',
                                mb: 1
                              }}
                            >
                              Recommended Actions:
                            </Typography>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <RemoveCircleOutline sx={{ fontSize: 16, color: '#64748B' }} />
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontFamily: 'SF Pro Text',
                                    color: '#64748B'
                                  }}
                                >
                                  Consider removing one of these features
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Merge sx={{ fontSize: 16, color: '#64748B' }} />
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontFamily: 'SF Pro Text',
                                    color: '#64748B'
                                  }}
                                >
                                  Or combine them into a single feature
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    <Box 
                      sx={{ 
                        mt: 2.5,
                        p: 2,
                        bgcolor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontFamily: 'SF Pro Text',
                          fontWeight: 600,
                          color: '#475569',
                          mb: 1
                        }}
                      >
                        💡 Understanding Correlations
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'SF Pro Text',
                          color: '#64748B',
                          lineHeight: 1.5
                        }}
                      >
                        High correlation between features can:
                        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                          <li>Make your model unstable</li>
                          <li>Lead to redundant information</li>
                          <li>Affect feature importance calculations</li>
                        </Box>
                      </Typography>
                    </Box>
                  </CardContent>
                </MuiCard>
              </Box>
            )}

            {selectedTab === 'outliers' && dataQualitySummary.groupedRecommendations?.outliers?.length > 0 && (
              <Box sx={{ 
                height: '400px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#94a3b8',
                  },
                },
                pr: 1,
                maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)'
              }}>
                {/* Existing Outliers Card Content */}
                <MuiCard 
                  sx={{ 
                    mb: 2.5,
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ErrorOutline sx={{ color: '#f57c00', mr: 1.5, fontSize: 24 }} />
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontFamily: 'SF Pro Display',
                            fontWeight: 600,
                            color: '#f57c00',
                            mb: 0.5
                          }}
                        >
                          Outliers Identified
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'SF Pro Text',
                            color: '#64748B'
                          }}
                        >
                          Some features contain unusual or extreme values
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={2}>
                      {dataQualitySummary.groupedRecommendations.outliers.map((rec, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 2,
                            bgcolor: rec.severity === 'high' ? '#fff3e0' : '#f5f5f5',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: rec.severity === 'high' ? '#ffe0b2' : '#e0e0e0'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: rec.severity === 'high' ? '#e65100' : '#424242'
                              }}
                            >
                              {rec.column}
                            </Typography>
                            <Box 
                              sx={{ 
                                px: 1.5,
                                py: 0.5,
                                bgcolor: rec.severity === 'high' ? '#fff3e0' : '#f5f5f5',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: rec.severity === 'high' ? '#ffe0b2' : '#e0e0e0'
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontFamily: 'SF Pro Text',
                                  fontWeight: 500,
                                  color: rec.severity === 'high' ? '#e65100' : '#424242'
                                }}
                              >
                                {rec.outlierCount} outliers ({rec.outlierPercentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Box>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'SF Pro Text',
                              color: '#64748B',
                              mb: 1.5
                            }}
                          >
                            {rec.message}
                          </Typography>

                          <Box sx={{ mt: 2 }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: '#475569',
                                display: 'block',
                                mb: 1
                              }}
                            >
                              How to Handle:
                            </Typography>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Search sx={{ fontSize: 16, color: '#64748B' }} />
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontFamily: 'SF Pro Text',
                                    color: '#64748B'
                                  }}
                                >
                                  Investigate if these are valid data points
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Transform sx={{ fontSize: 16, color: '#64748B' }} />
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontFamily: 'SF Pro Text',
                                    color: '#64748B'
                                  }}
                                >
                                  Consider capping or transforming extreme values
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    <Box 
                      sx={{ 
                        mt: 2.5,
                        p: 2,
                        bgcolor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontFamily: 'SF Pro Text',
                          fontWeight: 600,
                          color: '#475569',
                          mb: 1
                        }}
                      >
                        💡 About Outliers
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'SF Pro Text',
                          color: '#64748B',
                          lineHeight: 1.5
                        }}
                      >
                        Outliers can be:
                        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                          <li>Data entry errors that should be fixed</li>
                          <li>Genuine rare cases that might be important</li>
                          <li>Indicators of interesting patterns in your data</li>
                        </Box>
                      </Typography>
                    </Box>
                  </CardContent>
                </MuiCard>
              </Box>
            )}

            {selectedTab === 'skewed' && dataQualitySummary.groupedRecommendations?.skewed?.length > 0 && (
              <Box sx={{ 
                height: '400px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#94a3b8',
                  },
                },
                pr: 1,
                maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)'
              }}>
                {/* Existing Skewed Distribution Card Content */}
                <MuiCard 
                  sx={{ 
                    mb: 2.5,
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingDown sx={{ color: '#607d8b', mr: 1.5, fontSize: 24 }} />
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontFamily: 'SF Pro Display',
                            fontWeight: 600,
                            color: '#607d8b',
                            mb: 0.5
                          }}
                        >
                          Skewed Distributions Detected
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'SF Pro Text',
                            color: '#64748B'
                          }}
                        >
                          Some features have uneven distributions that may need transformation
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={2}>
                      {dataQualitySummary.groupedRecommendations.skewed.map((rec, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 2,
                            bgcolor: '#f5f5f5',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: '#424242'
                              }}
                            >
                              {rec.column}
                            </Typography>
                            <Box 
                              sx={{ 
                                px: 1.5,
                                py: 0.5,
                                bgcolor: '#f5f5f5',
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0'
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontFamily: 'SF Pro Text',
                                  fontWeight: 500,
                                  color: '#424242'
                                }}
                              >
                                Skewness: {rec.skewness.toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'SF Pro Text',
                              color: '#64748B',
                              mb: 1.5
                            }}
                          >
                            {rec.message}
                          </Typography>

                          <Box sx={{ mt: 2 }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: 'SF Pro Text',
                                fontWeight: 600,
                                color: '#475569',
                                display: 'block',
                                mb: 1
                              }}
                            >
                              Recommended Transformations:
                            </Typography>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Functions sx={{ fontSize: 16, color: '#64748B' }} />
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontFamily: 'SF Pro Text',
                                    color: '#64748B'
                                  }}
                                >
                                  {rec.skewness > 0 ? 'Log transformation for right-skewed data' : 'Square/Cube transformation for left-skewed data'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Transform sx={{ fontSize: 16, color: '#64748B' }} />
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontFamily: 'SF Pro Text',
                                    color: '#64748B'
                                  }}
                                >
                                  Consider standardization or normalization
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    <Box 
                      sx={{ 
                        mt: 2.5,
                        p: 2,
                        bgcolor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontFamily: 'SF Pro Text',
                          fontWeight: 600,
                          color: '#475569',
                          mb: 1
                        }}
                      >
                        💡 Why Transform Skewed Data?
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'SF Pro Text',
                          color: '#64748B',
                          lineHeight: 1.5
                        }}
                      >
                        Transforming skewed data can:
                        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                          <li>Improve model performance and stability</li>
                          <li>Make relationships more linear and easier to model</li>
                          <li>Help meet assumptions of statistical methods</li>
                        </Box>
                      </Typography>
                    </Box>
                  </CardContent>
                </MuiCard>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={3}>
        {/* Distribution Analysis */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              height: "100%", 
              borderRadius: "10px", 
              border: "1px solid #E2E8F0" 
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1E293B" }}>
              Distribution Analysis
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#64748B" }}>
              Analyze the distribution of your data values to identify patterns and potential issues.
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                fullWidth
                label="Select Feature"
                value={selectedDistributionFeature}
                onChange={handleDistributionFeatureChange}
                size="small"
                sx={{ mb: 2 }}
              >
                {response.columns.map((column) => {
                  const severity = featureSeverityMap[column]?.severity || "info";
                  return (
                    <MenuItem 
                      key={column} 
                      value={column}
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {column}
                        <Tooltip title={featureSeverityMap[column]?.message || ""} arrow>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            {severity === "success" && <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />}
                            {severity === "warning" && <WarningAmberIcon color="warning" sx={{ fontSize: 16 }} />}
                            {severity === "error" && <ErrorIcon color="error" sx={{ fontSize: 16 }} />}
                            {severity === "info" && <InfoIcon color="info" sx={{ fontSize: 16 }} />}
                          </Box>
                        </Tooltip>
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
              
              {(() => {
                const featureDistributionAlert = getDistributionAlertInfo();
                return (
                  <Tooltip 
                    title={
                      distributionInfo.dataType === 'numeric' 
                        ? `Skewness: ${distributionInfo.skewness.toFixed(2)}, Kurtosis: ${distributionInfo.kurtosis.toFixed(2)}, Normal Distribution: ${distributionInfo.isNormal ? 'Yes' : 'No'}`
                        : `Data type: ${distributionInfo.dataType}`
                    } 
                    arrow 
                    placement="top"
                  >
                    <Alert 
                      severity={featureDistributionAlert.severity}
                      sx={{ mb: 2, cursor: 'pointer' }}
                      icon={
                        featureDistributionAlert.severity === "warning" ? <WarningAmber /> : 
                        featureDistributionAlert.severity === "success" ? <CheckIcon /> : 
                        featureDistributionAlert.severity === "error" ? <ErrorOutline /> : <Info />
                      }
                    >
                      <Typography variant="body2">
                        {featureDistributionAlert.message}
                      </Typography>
                      {distributionInfo.dataType === 'numeric' && (
                        <Typography variant="caption" sx={{ display: 'block', color: '#64748B' }}>
                          Feature: {selectedDistributionFeature}
                        </Typography>
                      )}
                    </Alert>
                  </Tooltip>
                );
              })()}
              
              <HistogramChart 
                data={histogram} 
                feature={selectedDistributionFeature} 
                height={200} 
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Missing Values Analysis */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              height: "100%", 
              borderRadius: "10px", 
              border: "1px solid #E2E8F0" 
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1E293B" }}>
              Missing Values Analysis
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#64748B" }}>
              Identify patterns in missing data and get recommendations for handling them.
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                fullWidth
                label="View"
                value={selectedMissingValuesFeature}
                onChange={handleMissingValuesFeatureChange}
                size="small"
                sx={{ mb: 2 }}
              >
                <MenuItem value="all">All Features</MenuItem>
                {response.columns.map((column) => {
                  const severity = missingValuesSeverityMap[column]?.severity || "info";
                  return (
                    <MenuItem 
                      key={column} 
                      value={column}
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {column}
                        <Tooltip title={missingValuesSeverityMap[column]?.message || ""} arrow>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            {severity === "success" && <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />}
                            {severity === "warning" && <WarningAmberIcon color="warning" sx={{ fontSize: 16 }} />}
                            {severity === "error" && <ErrorIcon color="error" sx={{ fontSize: 16 }} />}
                            {severity === "info" && <InfoIcon color="info" sx={{ fontSize: 16 }} />}
                          </Box>
                        </Tooltip>
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
              
              {histogram && (
                <Alert 
                  severity={selectedMissingValuesFeature === 'all' 
                    ? (response.unfitRows > 0 || Object.keys(histogram).some(col => 
                        histogram[col] && histogram[col].some(val => 
                          val === null || val === undefined || val === '' || 
                          (typeof val === 'string' && val.trim() === '')
                        )
                      )
                      ? "warning"
                      : "success")
                    : (histogram[selectedMissingValuesFeature] && histogram[selectedMissingValuesFeature].some(val => 
                        val === null || val === undefined || val === '' || 
                        (typeof val === 'string' && val.trim() === '')
                      )
                      ? "warning"
                      : "success")
                  }
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body2">
                    {selectedMissingValuesFeature === 'all'
                      ? (response.unfitRows > 0 || Object.keys(histogram).some(col => 
                          histogram[col] && histogram[col].some(val => 
                            val === null || val === undefined || val === '' || 
                            (typeof val === 'string' && val.trim() === '')
                          )
                        )
                        ? `Missing values detected in the dataset. Consider imputing or removing them.` 
                        : "No missing values detected in the dataset.")
                      : (histogram[selectedMissingValuesFeature] && histogram[selectedMissingValuesFeature].some(val => 
                          val === null || val === undefined || val === '' || 
                          (typeof val === 'string' && val.trim() === '')
                        )
                        ? (() => {
                            const missingCount = histogram[selectedMissingValuesFeature].filter(val => 
                              val === null || val === undefined || val === '' || 
                              (typeof val === 'string' && val.trim() === '')
                            ).length;
                            const totalCount = histogram[selectedMissingValuesFeature].length;
                            const percentage = ((missingCount / totalCount) * 100).toFixed(1);
                            return `Feature "${selectedMissingValuesFeature}" has ${missingCount} missing values (${percentage}% of data). Consider imputing these values.`;
                          })()
                        : `Feature "${selectedMissingValuesFeature}" has no missing values.`)
                    }
                  </Typography>
                </Alert>
              )}
              
              {histogram ? (
                <MissingValuesHeatmap 
                  data={histogram} 
                  columns={response.columns}
                  selectedView={selectedMissingValuesFeature}
                  height={200}
                  hideSummary={true}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 200, 
                    bgcolor: "#F1F5F9", 
                    borderRadius: "8px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 2, color: "#64748B" }}>
                    Loading data...
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Correlation Analysis */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              height: "100%", 
              borderRadius: "10px", 
              border: "1px solid #E2E8F0" 
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1E293B" }}>
              Correlation Analysis
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#64748B" }}>
              Discover relationships between features and identify potential redundancies.
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                fullWidth
                label="View"
                value={selectedCorrelationFeature}
                onChange={handleCorrelationFeatureChange}
                size="small"
                sx={{ mb: 2 }}
              >
                <MenuItem value="all">All Features</MenuItem>
                {response.columns.map((column) => {
                  const severity = correlationSeverityMap[column]?.severity || "info";
                  return (
                    <MenuItem 
                      key={column} 
                      value={column}
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {column}
                        <Tooltip title={correlationSeverityMap[column]?.message || ""} arrow>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            {severity === "success" && <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />}
                            {severity === "warning" && <WarningAmberIcon color="warning" sx={{ fontSize: 16 }} />}
                            {severity === "error" && <ErrorIcon color="error" sx={{ fontSize: 16 }} />}
                            {severity === "info" && <InfoIcon color="info" sx={{ fontSize: 16 }} />}
                          </Box>
                        </Tooltip>
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
              
              <Alert 
                severity={correlationAlert.severity}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  {correlationAlert.message}
                </Typography>
              </Alert>
              
              {histogram ? (
                <CorrelationMatrix 
                  data={histogram} 
                  columns={response.columns}
                  selectedView={selectedCorrelationFeature}
                  height={200}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: "200px", 
                    bgcolor: "#F1F5F9", 
                    borderRadius: "8px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 2, color: "#64748B" }}>
                    Loading data...
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Outlier Analysis */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              height: "100%", 
              borderRadius: "10px", 
              border: "1px solid #E2E8F0" 
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1E293B" }}>
                Outlier Analysis
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Identify extreme values that may affect model performance and consider removing them.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                <InputLabel id="outlier-feature-select-label">View</InputLabel>
                <Select
                  labelId="outlier-feature-select-label"
                  id="outlier-feature-select"
                  value={selectedOutlierFeature}
                  label="View"
                  onChange={handleOutlierFeatureChange}
                >
                  <MenuItem value="all">All Features</MenuItem>
                  {response.columns.map((column) => {
                    const severity = outlierSeverityMap[column]?.severity || "info";
                    return (
                      <MenuItem 
                        key={column} 
                        value={column}
                        sx={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {column}
                          <Tooltip title={outlierSeverityMap[column]?.message || ""} arrow>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                              {severity === "success" && <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />}
                              {severity === "warning" && <WarningAmberIcon color="warning" sx={{ fontSize: 16 }} />}
                              {severity === "error" && <ErrorIcon color="error" sx={{ fontSize: 16 }} />}
                              {severity === "info" && <InfoIcon color="info" sx={{ fontSize: 16 }} />}
                            </Box>
                          </Tooltip>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              
              <Alert 
                severity={outlierAlert.severity} 
                icon={outlierAlert.severity === "warning" ? <WarningAmber /> : undefined}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">{outlierAlert.message}</Typography>
              </Alert>
            </Box>
            
            {histogram && (
              <OutlierBoxplot 
                data={histogram} 
                columns={response.columns || []} 
                selectedView={selectedOutlierFeature}
                height={300}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

const Body = ({ backDialogOpen, setBackDialogOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector(state => state.tasks);
  const learningProgress = useSelector(state => state.learningProgress);

  const { name, type, isLoading, response, histogram, mode } = useSelector(
    (state) => state.model
  );

  const [descrip, setDescrip] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [tooltipId, setTooltipId] = useState(0);
  
  // State for Advanced Data Quality section
  const [selectedDistributionFeature, setSelectedDistributionFeature] = useState('');
  const [selectedMissingValuesFeature, setSelectedMissingValuesFeature] = useState('all');
  const [selectedCorrelationFeature, setSelectedCorrelationFeature] = useState('all');
  const [selectedOutlierFeature, setSelectedOutlierFeature] = useState('all');

  // FAB state management
  const [fabOpen, setFabOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentTutorialData, setCurrentTutorialData] = useState(dataPreprocessingTutorialData);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState(dataPreprocessingQuizQuestions);
  const model = useSelector((state) => state.model);

  const [selectedTab, setSelectedTab] = useState('missing_values');

  const [dataQualitySummary, setDataQualitySummary] = useState({
    summary: "",
    recommendations: [],
    groupedRecommendations: {},
    overallQuality: "medium" // "good", "medium", or "poor"
  });

  const [dataQualityAlerts, setDataQualityAlerts] = useState({});

  // Add severity map states
  const [featureSeverityMap, setFeatureSeverityMap] = useState({});
  const [missingValuesSeverityMap, setMissingValuesSeverityMap] = useState({});
  const [correlationSeverityMap, setCorrelationSeverityMap] = useState({});
  const [outlierSeverityMap, setOutlierSeverityMap] = useState({});

  // Add severity check functions as useCallback hooks
  const getFeatureSeverity = useCallback((column) => {
    if (!histogram || !histogram[column]) {
      return { severity: "info", message: "" };
    }
    
    try {
      const data = histogram[column];
      
      if (!Array.isArray(data) || data.length === 0) {
        return { severity: "error", message: "No data available" };
      }

      const numericData = data.filter(d => typeof d === 'number' && !isNaN(d));
      if (numericData.length === 0) {
        return { severity: "info", message: "Categorical feature" };
      }

      // Check for constant values
      const isConstant = numericData.every(val => val === numericData[0]);
      if (isConstant) {
        return { severity: "warning", message: `${column} has constant values - consider removing it` };
      }

      // Calculate statistics
      const mean = numericData.reduce((sum, val) => sum + val, 0) / numericData.length;
      const variance = numericData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericData.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev === 0) {
        return { severity: "warning", message: `${column} has zero variance - consider removing it` };
      }

      // Calculate skewness
      const skewness = numericData.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / numericData.length;
      
      if (Math.abs(skewness) > 1.5) {
        return { 
          severity: "warning", 
          message: `${column} is highly skewed (${skewness.toFixed(2)}) - consider transformation` 
        };
      }

      return { severity: "info", message: "Normal distribution" };
    } catch (error) {
      return { severity: "error", message: "Analysis error" };
    }
  }, [histogram]);

  const getMissingValuesSeverity = useCallback((column) => {
    if (!histogram || !histogram[column]) {
      return { severity: "info", message: "" };
    }
    
    try {
      const data = histogram[column];
      
      if (!Array.isArray(data) || data.length === 0) {
        return { severity: "error", message: "No data available" };
      }

      // Calculate missing values
      const missingCount = data.filter(val => 
        val === null || val === undefined || val === '' || 
        (typeof val === 'string' && val.trim() === '')
      ).length;
      
      const missingPercentage = (missingCount / data.length) * 100;
      
      if (missingCount === 0) {
        return { severity: "success", message: "No missing values" };
      } else if (missingPercentage > 50) {
        return { 
          severity: "error", 
          message: `${column} has ${missingPercentage.toFixed(1)}% missing values - consider removing` 
        };
      } else if (missingPercentage > 20) {
        return { 
          severity: "warning", 
          message: `${column} has ${missingPercentage.toFixed(1)}% missing values - consider imputation` 
        };
      }

      return { severity: "info", message: `${missingPercentage.toFixed(1)}% missing` };
    } catch (error) {
      return { severity: "error", message: "Analysis error" };
    }
  }, [histogram]);

  const getCorrelationSeverity = useCallback((column) => {
    // Since we don't have correlation data in the review stage, return info
    return { severity: "info", message: "Correlation analysis not available in review stage" };
  }, []);

  const getOutlierSeverity = useCallback((column) => {
    // Since we don't have outlier data in the review stage, return info
    return { severity: "info", message: "Outlier analysis not available in review stage" };
  }, []);

  // Add effect to update severity maps when data changes
  useEffect(() => {
    if (!response || !response.columns) return;

    const newFeatureSeverityMap = {};
    const newMissingValuesSeverityMap = {};
    const newCorrelationSeverityMap = {};
    const newOutlierSeverityMap = {};

    response.columns.forEach(column => {
      // Feature severity
      const featureSeverity = getFeatureSeverity(column);
      if (featureSeverity.severity !== 'info') {
        newFeatureSeverityMap[column] = featureSeverity;
      }

      // Missing values severity
      const missingValuesSeverity = getMissingValuesSeverity(column);
      if (missingValuesSeverity.severity !== 'info') {
        newMissingValuesSeverityMap[column] = missingValuesSeverity;
      }

      // Correlation severity
      const correlationSeverity = getCorrelationSeverity(column);
      if (correlationSeverity.severity !== 'info') {
        newCorrelationSeverityMap[column] = correlationSeverity;
      }

      // Outlier severity
      const outlierSeverity = getOutlierSeverity(column);
      if (outlierSeverity.severity !== 'info') {
        newOutlierSeverityMap[column] = outlierSeverity;
      }
    });

    setFeatureSeverityMap(newFeatureSeverityMap);
    setMissingValuesSeverityMap(newMissingValuesSeverityMap);
    setCorrelationSeverityMap(newCorrelationSeverityMap);
    setOutlierSeverityMap(newOutlierSeverityMap);
  }, [response, getFeatureSeverity, getMissingValuesSeverity, getCorrelationSeverity, getOutlierSeverity]);

  // Add this function to collect alerts
  const collectDataQualityAlerts = useCallback(() => {
    const alerts = {};
    
    if (!response || !response.columns) return alerts;

    response.columns.forEach(column => {
      const columnAlerts = [];
      
      // Distribution alerts
      if (featureSeverityMap[column]?.severity === 'warning' || featureSeverityMap[column]?.severity === 'error') {
        columnAlerts.push({
          severity: featureSeverityMap[column].severity,
          message: featureSeverityMap[column].message,
          type: 'distribution'
        });
      }

      // Missing values alerts
      if (missingValuesSeverityMap[column]?.severity === 'warning' || missingValuesSeverityMap[column]?.severity === 'error') {
        columnAlerts.push({
          severity: missingValuesSeverityMap[column].severity,
          message: missingValuesSeverityMap[column].message,
          type: 'missing'
        });
      }

      if (columnAlerts.length > 0) {
        alerts[column] = columnAlerts;
      }
    });

    return alerts;
  }, [response, featureSeverityMap, missingValuesSeverityMap]);

  // Add effect to update alerts when severity maps change
  useEffect(() => {
    const alerts = collectDataQualityAlerts();
    setDataQualityAlerts(alerts);
  }, [collectDataQualityAlerts]);

  useEffect(() => {
    if (response) {
      // Set default selected feature when response is loaded
      if (response.columns && response.columns.length > 0) {
        setSelectedDistributionFeature(response.columns[0]);
      }
      
      const columnsArray = [];
      response.columns.map(key =>
        columnsArray.push({
          field: String(key),
          headerName: String(key),
          sortable: false,
          editable: true,
          tooltipClasses: "none"
        })
      )

      columnsArray.push({
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      });

      setColumns(columnsArray);
    }
  }, [response, rowModesModel]);

  useEffect(() => {
    if (histogram) {
      const keys = Object.keys(histogram);

      const convertedData = histogram[keys[0]].map((_, index) => {
        const newObj = {};
        keys.forEach(key => {
          newObj[key] = histogram[key][index];
        })
        newObj['id'] = String(index);
        return newObj;
      })

      setValues(convertedData);
    }
  }, [histogram]);

  useEffect(() => {
    setTooltipId(mode);
    // console.log("Review Mode:", mode);
    // console.log("Review TooltipID:", tooltipId);
  }, [mode]);

  useEffect(() => {
    // console.log("Review dispatch", tooltipId);
    if (tooltipId === 15 || tooltipId === 23) dispatch({ type: "TOGGLE_MODE", payload: tooltipId });
    // console.log("After Dispatch Mode:", mode);
    // console.log("After Dispatch TooltipID:", tooltipId);
  }, [tooltipId])

  const handleOpen = () => { };

  const handleClose = () => { };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setValues(values.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = values.find((row) => row.id === id);
    if (editedRow.isNew) {
      setValues(values.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setValues(values.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleBack = () => {
    setBackDialogOpen(true);
  };
  const onClick = () => {
    dispatch(saveDescription(descrip));
    navigate("/select");
  };

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

  return isLoading ? (
    <Backdrop className="main"
      sx={{ padding: "30px", backgroundColor: "#F5F5F5", zIndex: (theme) => theme.zIndex.drawer + 1, position: "inherit", gap: "1em" }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
      <Typography fontSize="1.5em" fontWeight="bold">Analysing...</Typography>
    </Backdrop>
  ) : (
    <Card className="main"
      sx={{
        flex: 1,
        backgroundColor: "#F5F5F5",
        overflowX: "hidden",
        overflowY: "auto",
        padding: "30px",
      }}
    // sx={{
    //   display: "flex",
    //   flexDirection: "column",
    //   gap: "2.5em",
    //   flex: "1",
    //   margin: "2em",
    //   padding: "2em",
    //   borderRadius: "20px",
    // }}
    >
      <Paper sx={{ width: "100%", padding: "20px", borderRadius: "20px" }}>
        {/* Header Section */}
        <Box 
          sx={{ 
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton 
              onClick={() => setBackDialogOpen(true)}
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
                Preprocessing
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.95rem", md: ".95rem" },
                  fontWeight: 400,
                  fontFamily: "'SF Pro Display', sans-serif",
                  color: "#64748B"
                }}
              >
                Review and clean your data to prepare it for model training
              </Typography>
            </Box>
          </Box>          
            <Paper
              onClick={() => setOpenEdit(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "12px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              <img 
                src={`${process.env.PUBLIC_URL}/img/${model.type}.png`} 
                alt={model.type}
                style={{ 
                  width: 24, 
                  height: 24,
                  marginRight: 12
                }}
              />
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  fontFamily: "'SF Pro Display', sans-serif",
                  color: "#1E293B"
                }}
              >
                {model.name}
              </Typography>
            </Paper>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "2.5em",
            marginTop: "0.5em"
          }}
        >
          <Box sx={{ width: "15em" }}>
            <Box
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                margin: "0 0 1.5em 0",
              }}
            >
              <Typography
                sx={{
                  fontSize: { lg: "1.6rem", md: "1.2rem" },
                  fontWeight: "bolder",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}>
                File Fitness
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}>
                Ensure all the boxes below are green
              </Typography>
            </Box>
            {/* {response && response.fileFitForUse ? ( */}
              <Alert severity="success" sx={{ margin: "1em 0" }}>
                File is fit for predictions.
              </Alert>
            {/* ) : (
              <Alert severity="error" sx={{ margin: "1em 0" }}>
                File is not fit for predictions.
              </Alert>
            )} */}

            <CustomTooltip
              open={tooltipId === 15 ? true : false}
              onOpen={handleOpen}
              onClose={handleClose}
              title={
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>At a glance, check if your file is ready for predictions. Ensure
                    all boxes are green for the best outcomes!</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(14)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(16)}>NEXT</Button>
                  </Box>
                </Box>
              }
              placement="right"
              arrow
            >
              <Box>
                <CustomTooltip
                  open={tooltipId === 16 ? true : false}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  title={
                    <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                      <Typography>
                        {"Quickly view the size of your dataset (rows). Remember, more data often means better model accuracy."}</Typography>
                      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(15)}>PREVIOUS</Button>
                        <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(17)}>NEXT</Button>
                      </Box>
                    </Box>
                  }
                  placement="right"
                  arrow
                >
                  <Box>
                    <HtmlTooltip placement="right"
                      title={
                        <React.Fragment>
                          <b>{" There should be 30 times as many rows as there are columns. "}</b>
                        </React.Fragment>}>

                        {response && response.rows ? (
                        <Alert
                          icon={<CheckIcon fontSize="inherit" />}
                          sx={{ margin: "1em 0" }}
                          severity="success"
                        >
                          Total Rows: {response.rows}
                        </Alert>
                      ) : (
                        ""
                      )}
                      {/* {response && response.rows ? (
                        <Alert
                          icon={
                            response.rows < response.columnsLength * 30 ? (
                              <CloseIcon fontSize="inherit" />
                            ) : (
                              <CheckIcon fontSize="inherit" />
                            )
                          }
                          sx={{ margin: "1em 0" }}
                          severity={
                            response.rows < response.columnsLength * 30
                              ? "error"
                              : "success"
                          }
                        >
                          Total Rows: {response.rows}
                        </Alert>
                      ) : (
                        ""
                      )} */}
                    </HtmlTooltip>

                    <HtmlTooltip placement="right"
                      title={
                        <React.Fragment>
                          <b>{" There must be at least 2 columns in the dataset "}</b>
                        </React.Fragment>}>

                      {response && response.columnsLength ? (
                        <Alert
                          icon={<CheckIcon fontSize="inherit" />}
                          sx={{ margin: "1em 0" }}
                          severity="success"
                        >
                          Total Columns: {response.columnsLength}
                        </Alert>
                      ) : (
                        ""
                      )}
                    </HtmlTooltip>
                  </Box>
                </CustomTooltip>


                <HtmlTooltip placement="right"
                  title={
                    <React.Fragment>
                      <b>{" Amount of rows that contain empty values "}</b>
                    </React.Fragment>}>
                  {response ? (
                    <Alert
                      icon={response.unfitRows > 0 ? <CloseIcon fontSize="inherit" /> : <CheckIcon fontSize="inherit" />}
                      sx={{ margin: "1em 0" }}
                      severity={response.unfitRows > 0 ? "error" : "success"}
                    >
                      Unfit Rows: {response.unfitRows}
                    </Alert>
                  ) : (
                    ""
                  )}
                </HtmlTooltip>

                <HtmlTooltip placement="right"
                  title={
                    <React.Fragment>
                      <b>{" Amount of columns that are empty "}</b>
                    </React.Fragment>}>
                  {response ? (
                    <Alert
                      icon={response.unfitColumns > 0 ? <CloseIcon fontSize="inherit" /> : <CheckIcon fontSize="inherit" />}
                      sx={{ margin: "1em 0" }}
                      severity={response.unfitColumns > 0 ? "error" : "success"}
                    >
                      Unfit Columns: {response.unfitColumns}
                    </Alert>
                  ) : (
                    ""
                  )}
                </HtmlTooltip>
              </Box>
            </CustomTooltip>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                margin: "0 0 1.5em 0",
              }}
            >
              <Typography
                sx={{
                  fontSize: { lg: "1.6rem", md: "1.2rem" },
                  fontWeight: "bolder",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}>
                Features
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}>
                Review data for missing values and assess feature fitness
              </Typography>
            </Box>
            <TableComponent descrip={descrip} setDescrip={setDescrip} tooltipId={tooltipId} setTooltipId={setTooltipId} />
          </Box>
        </Box>
              

        <Box sx={{ flex: 1, marginTop: '5em' }}>
          <Box
            sx={{
              fontFamily: "'SF Pro Display', sans-serif",
              margin: "0 0 1.5em 0",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: "bolder",
                fontFamily: "'SF Pro Display', sans-serif",
              }}>
              Advanced Data Quality
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontFamily: "'SF Pro Display', sans-serif",
              }}>
              In-depth analysis of your dataset's quality and potential issues
            </Typography>
          </Box>
          
          <CustomTooltip
            open={tooltipId === 19 || tooltipId === 20 ? true : false}
            onOpen={handleOpen}
            onClose={handleClose}
            title={
              tooltipId === 19 ? (
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>{"A sneak peek at your dataset's characteristics. Spot missing cells, duplicate rows, and more."}</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(18)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(20)}>NEXT</Button>
                  </Box>
                </Box>
              ) : (
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>{"Click on the Alerts section to inspect the dataset in detail. Consider removing columns with more than 50% zeros or empty values"}</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(19)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(22)}>NEXT</Button>
                  </Box>
                </Box>
              )
            }
            placement="top"
            arrow
          >
            <Box>
              <AdvancedDataQuality response={response} />
            </Box>
          </CustomTooltip>
        </Box>

        <Box sx={{ flex: 1, marginTop: '2em' }}>
          {/* <Box
            sx={{
              fontFamily: "'SF Pro Display', sans-serif",
              margin: "0 0 1.5em 0",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: "bolder",
                fontFamily: "'SF Pro Display', sans-serif",
              }}>
              Data Editor
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontFamily: "'SF Pro Display', sans-serif",
              }}>
              Explore, handle missing rows and prepare your dataset
            </Typography>
          </Box>
          <CustomTooltip
            open={tooltipId === 21 ? true : false}
            onOpen={handleOpen}
            onClose={handleClose}
            title={
              <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                <Typography>{"Tailor your raw data here. While VisAutoML handles major adjustments, you can fine-tune column names, data formats, and specific values for precision."}</Typography>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(20)}>PREVIOUS</Button>
                  <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(22)}>NEXT</Button>
                </Box>
              </Box>
            }
            placement="top"
            arrow
          >
            <Box
              sx={{
                height: '600px',
                width: '100%',
                '& .actions': {
                  color: 'text.secondary',
                },
                '& .textPrimary': {
                  color: 'text.primary',
                },
              }}
            >
              <DataGrid
                rows={values}
                columns={columns}
                editMode="row"
                disableColumnMenu={true}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
              />
            </Box>
          </CustomTooltip> */}
              {/* <Paper 
              sx={{ 
                padding: "20px", 
                borderRadius: "20px",
                backgroundColor: "#ffffff" 
              }}>

                </Paper> */}
                </Box>

            <Box sx={{ display: "flex", justifyContent: "end", margin: "1em 0 0 0" }}>
              <CustomTooltip
                open={tooltipId === 22 ? true : false}
                onOpen={handleOpen}
                onClose={handleClose}
                title={
                  <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                    <Typography>{"By clicking 'Process Data', the system will automatically impute missing data using the mean, remove duplicate values, and address outliers for you."}</Typography>
                    <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(21)}>PREVIOUS</Button>
                      <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(23)}>OKAY</Button>
                    </Box>
                  </Box>
                }
                placement="top-start"
                arrow
              >
                <Button
                  variant="contained"
                  sx={{ borderRadius: "15px" }}
                  onClick={onClick}
                >
                  Process Data
                </Button>
              </CustomTooltip>
            </Box>
      </Paper>
      <EditDialog open={openEdit} setOpen={setOpenEdit} modelName={name} />
      <TutorialComponent
        tutorialData={currentTutorialData}
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
        conceptName={
          currentTutorialData === mlTutorialData ? "Machine Learning" :
          currentTutorialData === dataBasicsTutorialData ? "Data Basics" :
          "Data Preprocessing"
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
          "Data Preprocessing"
        }
      />
      <EducationalFAB
        open={fabOpen}
        onToggle={handleFabToggle}
        tasks={tasks}
        onTaskStart={handleTaskStart}
        onTaskComplete={handleTaskComplete}
        progress={learningProgress}
        onQuizRedo={handleQuizRedo}
        currentPage="review"
        sx={{ zIndex: 1300 }}
      />
    </Card>
  );
};

export default Body;
