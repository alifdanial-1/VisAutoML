import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  Line,
  Rectangle,
  Scatter
} from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';

// Custom BoxPlot component for Recharts
const BoxPlot = (props) => {
  const { x, y, width, height, q1, median, q3, min, max, fill, stroke } = props;
  
  const boxHeight = q3 - q1;
  const boxY = y + height - q3 * height;
  const medianY = y + height - median * height;
  const minY = y + height - min * height;
  const maxY = y + height - max * height;
  
  return (
    <g>
      {/* IQR Box */}
      <Rectangle
        x={x - width / 2}
        y={boxY}
        width={width}
        height={boxHeight * height}
        fill={fill}
        stroke={stroke}
      />
      
      {/* Median line */}
      <line
        x1={x - width / 2}
        y1={medianY}
        x2={x + width / 2}
        y2={medianY}
        stroke="#FFFFFF"
        strokeWidth={2}
      />
      
      {/* Min whisker */}
      <line
        x1={x}
        y1={boxY + boxHeight * height}
        x2={x}
        y2={minY}
        stroke={stroke}
        strokeDasharray="3 3"
      />
      
      {/* Max whisker */}
      <line
        x1={x}
        y1={boxY}
        x2={x}
        y2={maxY}
        stroke={stroke}
        strokeDasharray="3 3"
      />
      
      {/* Min cap */}
      <line
        x1={x - width / 3}
        y1={minY}
        x2={x + width / 3}
        y2={minY}
        stroke={stroke}
      />
      
      {/* Max cap */}
      <line
        x1={x - width / 3}
        y1={maxY}
        x2={x + width / 3}
        y2={maxY}
        stroke={stroke}
      />
    </g>
  );
};

const OutlierBoxplot = ({ data, columns, selectedView = 'all', height = 200 }) => {
  const [boxplotData, setBoxplotData] = useState([]);
  const [outliers, setOutliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [normalizedData, setNormalizedData] = useState([]);

  useEffect(() => {
    console.log('OutlierBoxplot - Initializing with:', { 
      dataExists: !!data, 
      columnsExist: !!columns, 
      columnsLength: columns?.length,
      selectedView
    });
    
    setLoading(true);
    setError(null);
    
    try {
      if (!data || !columns || columns.length === 0) {
        console.log('OutlierBoxplot - Missing data or columns');
        setError('No data available');
        setLoading(false);
        return;
      }

      // Determine which columns to analyze
      let columnsToAnalyze = [];
      if (selectedView === 'all') {
        // For all columns, limit to numerical columns
        columnsToAnalyze = columns.filter(column => {
          if (!data[column]) return false;
          
          // Check if column has numeric data
          const numericCount = data[column].filter(val => 
            val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val)
          ).length;
          
          return numericCount > data[column].length * 0.5;
        });
        
        // Limit to at most 5 columns for visualization clarity
        if (columnsToAnalyze.length > 5) {
          columnsToAnalyze = columnsToAnalyze.slice(0, 5);
        }
      } else {
        // For single column view
        if (data[selectedView]) {
          columnsToAnalyze = [selectedView];
        }
      }
      
      console.log('OutlierBoxplot - Columns to analyze:', columnsToAnalyze);
      
      if (columnsToAnalyze.length === 0) {
        console.log('OutlierBoxplot - No numeric columns for outlier analysis');
        setError('No numeric columns available for outlier analysis');
        setLoading(false);
        return;
      }
      
      // Calculate boxplot statistics and detect outliers
      const boxplotStats = {};
      const outlierPoints = [];
      const normalizedBoxplotData = [];
      
      columnsToAnalyze.forEach((column, index) => {
        // Convert column data to numeric
        const numericData = data[column]
          .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
          .map(val => parseFloat(val));
        
        if (numericData.length === 0) return;
        
        // Sort data for calculations
        const sortedData = [...numericData].sort((a, b) => a - b);
        
        // Calculate quartiles
        const q1Index = Math.floor(sortedData.length * 0.25);
        const q2Index = Math.floor(sortedData.length * 0.5);
        const q3Index = Math.floor(sortedData.length * 0.75);
        
        const q1 = sortedData[q1Index];
        const median = sortedData[q2Index];
        const q3 = sortedData[q3Index];
        
        // Calculate IQR and whiskers
        const iqr = q3 - q1;
        const lowerWhisker = Math.max(sortedData[0], q1 - 1.5 * iqr);
        const upperWhisker = Math.min(sortedData[sortedData.length - 1], q3 + 1.5 * iqr);
        
        // Identify outliers
        const lowerOutliers = sortedData.filter(val => val < lowerWhisker);
        const upperOutliers = sortedData.filter(val => val > upperWhisker);
        const allOutliers = [...lowerOutliers, ...upperOutliers];
        
        console.log(`OutlierBoxplot - ${column} statistics:`, {
          q1, median, q3, iqr, lowerWhisker, upperWhisker,
          outliers: allOutliers.length
        });
        
        // Store statistics
        boxplotStats[column] = {
          min: sortedData[0],
          max: sortedData[sortedData.length - 1],
          q1,
          median,
          q3,
          lowerWhisker,
          upperWhisker,
          outlierCount: allOutliers.length,
          outlierPercentage: (allOutliers.length / numericData.length) * 100
        };
        
        // Find the global min and max for normalization
        const globalMin = Math.min(sortedData[0], ...lowerOutliers);
        const globalMax = Math.max(sortedData[sortedData.length - 1], ...upperOutliers);
        const range = globalMax - globalMin;
        
        // Normalize the boxplot values to [0,1] range for rendering
        if (range > 0) {
          normalizedBoxplotData.push({
            name: column,
            min: (lowerWhisker - globalMin) / range,
            q1: (q1 - globalMin) / range,
            median: (median - globalMin) / range,
            q3: (q3 - globalMin) / range,
            max: (upperWhisker - globalMin) / range,
            columnIndex: index,
            // Store original values for tooltip
            originalMin: lowerWhisker,
            originalQ1: q1,
            originalMedian: median,
            originalQ3: q3,
            originalMax: upperWhisker,
            globalMin,
            globalMax
          });
          
          // Add outlier points for visualization
          allOutliers.forEach(value => {
            outlierPoints.push({
              x: index,
              y: (value - globalMin) / range,
              column,
              value // Original value for tooltip
            });
          });
        }
      });
      
      console.log('OutlierBoxplot - Statistics:', boxplotStats);
      console.log('OutlierBoxplot - Outliers:', { count: outlierPoints.length });
      console.log('OutlierBoxplot - Normalized data:', normalizedBoxplotData);
      
      setBoxplotData(normalizedBoxplotData);
      setNormalizedData(normalizedBoxplotData);
      setOutliers(outlierPoints);
      setStatistics(boxplotStats);
      setLoading(false);
    } catch (err) {
      console.error('OutlierBoxplot - Error analyzing outliers:', err);
      setError('Error analyzing outliers: ' + err.message);
      setLoading(false);
    }
  }, [data, columns, selectedView]);

  // Loading state
  if (loading) {
    return (
      <Box 
        sx={{ 
          height: height, 
          bgcolor: "#F1F5F9", 
          borderRadius: "8px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2, color: "#64748B" }}>
          Analyzing outliers...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error || boxplotData.length === 0) {
    return (
      <Box 
        sx={{ 
          height: height, 
          bgcolor: "#F1F5F9", 
          borderRadius: "8px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          flexDirection: "column",
          p: 2
        }}
      >
        <Typography variant="body2" sx={{ color: "#64748B", textAlign: "center" }}>
          {error || "No data available for outlier analysis"}
        </Typography>
      </Box>
    );
  }

  // Custom tooltip for the boxplot
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Check if this is an outlier point
      if (payload[0].dataKey === 'y') {
        const data = payload[0].payload;
        
        return (
          <Box sx={{ bgcolor: "#fff", p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>{data.column}</strong>
            </Typography>
            <Typography variant="body2">
              Value: {data.value.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#F44336', fontWeight: 'bold' }}>
              ⚠️ Outlier detected
            </Typography>
          </Box>
        );
      }
      
      // Regular boxplot tooltip
      const columnName = label;
      const stats = statistics[columnName];
      
      if (!stats) return null;
      
      return (
        <Box sx={{ bgcolor: "#fff", p: 1, border: "1px solid #ccc", borderRadius: 1, maxWidth: 200 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 0.5, mb: 0.5 }}>
            {columnName}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Minimum:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {stats.lowerWhisker.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Q1 (25%):
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {stats.q1.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Median:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {stats.median.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Q3 (75%):
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {stats.q3.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Maximum:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {stats.upperWhisker.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 0.5, 
            pt: 0.5, 
            borderTop: '1px solid #eee',
            color: stats.outlierCount > 0 ? '#F44336' : '#4CAF50'
          }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 'bold' }}>
              Outliers:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {stats.outlierCount} ({stats.outlierPercentage.toFixed(1)}%)
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Get the total number of outliers
  const getTotalOutliers = () => {
    return outliers.length;
  };

  // Get the column with the most outliers
  const getMostOutliersColumn = () => {
    if (Object.keys(statistics).length === 0) return null;
    
    return Object.entries(statistics)
      .sort((a, b) => b[1].outlierCount - a[1].outlierCount)[0];
  };

  // Render the boxplot
  return (
    <Box sx={{ width: '100%', height: height }}>
      {/* <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 'medium' }}>
          {getTotalOutliers() > 0 
            ? `Found ${getTotalOutliers()} outliers across ${boxplotData.length} numeric columns` 
            : "No outliers detected in the analyzed columns"}
        </Typography>
        {getMostOutliersColumn() && getMostOutliersColumn()[1].outlierCount > 0 && (
          <Typography variant="caption" sx={{ display: 'block', color: "#64748B" }}>
            Most outliers in "{getMostOutliersColumn()[0]}": {getMostOutliersColumn()[1].outlierCount} ({getMostOutliersColumn()[1].outlierPercentage.toFixed(1)}%)
          </Typography>
        )}
      </Box> */}
      
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
          <XAxis 
            dataKey="name" 
            type="category"
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 1]} 
            tick={false}
            label={{ 
              value: 'Distribution', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#64748B', fontSize: 12 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Render custom boxplots */}
          {normalizedData.map((entry, index) => (
            <BoxPlot
              key={`boxplot-${index}`}
              x={index}
              y={0}
              width={40}
              height={400}
              q1={entry.q1}
              median={entry.median}
              q3={entry.q3}
              min={entry.min}
              max={entry.max}
              fill="#8884d8"
              stroke="#6A5ACD"
            />
          ))}
          
          {/* Render outlier points */}
          <Scatter 
            data={outliers} 
            fill="#F44336" 
            dataKey="y"
            name="Outliers"
            shape="circle"
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#8884d8', mr: 0.5 }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Box (Q1-Q3)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Box sx={{ width: 12, height: 2, bgcolor: '#6A5ACD', mr: 0.5 }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Median</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Box sx={{ width: 12, height: 0, border: '1px dashed #6A5ACD', mr: 0.5 }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Whiskers</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 8, height: 8, bgcolor: '#F44336', borderRadius: '50%', mr: 0.5 }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Outliers</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OutlierBoxplot; 