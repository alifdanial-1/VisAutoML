import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  Tooltip, 
  Cell,
  Legend
} from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';

const CorrelationMatrix = ({ data, columns, selectedView = 'all', height = 200 }) => {
  const [correlationData, setCorrelationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedFeatures, setHighlightedFeatures] = useState([]);

  useEffect(() => {
    console.log('CorrelationMatrix - Initializing with:', { 
      dataExists: !!data, 
      columnsExist: !!columns, 
      columnsLength: columns?.length,
      selectedView
    });
    
    setLoading(true);
    setError(null);
    
    try {
      if (!data || !columns || columns.length === 0) {
        console.log('CorrelationMatrix - Missing data or columns');
        setError('No data available');
        setLoading(false);
        return;
      }

      // Determine which columns to analyze
      let columnsToAnalyze = [];
      if (selectedView === 'all') {
        // For all columns, limit to numerical columns to avoid excessive computation
        columnsToAnalyze = columns.filter(column => {
          if (!data[column]) return false;
          
          // Check if column has numeric data
          const numericCount = data[column].filter(val => 
            val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val)
          ).length;
          
          return numericCount > data[column].length * 0.5;
        });
        
        // Limit to at most 10 columns for visualization clarity
        if (columnsToAnalyze.length > 10) {
          columnsToAnalyze = columnsToAnalyze.slice(0, 10);
        }
      } else {
        // For single column view, find correlations with other columns
        columnsToAnalyze = columns.filter(column => {
          if (column === selectedView) return false;
          if (!data[column]) return false;
          
          // Check if column has numeric data
          const numericCount = data[column].filter(val => 
            val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val)
          ).length;
          
          return numericCount > data[column].length * 0.5;
        });
        
        // Add the selected column first
        if (data[selectedView]) {
          columnsToAnalyze.unshift(selectedView);
        }
        
        // Limit to at most 10 columns for visualization clarity
        if (columnsToAnalyze.length > 10) {
          columnsToAnalyze = columnsToAnalyze.slice(0, 10);
        }
      }
      
      console.log('CorrelationMatrix - Columns to analyze:', columnsToAnalyze);
      
      if (columnsToAnalyze.length < 2) {
        console.log('CorrelationMatrix - Not enough numeric columns for correlation analysis');
        setError('Not enough numeric columns for correlation analysis');
        setLoading(false);
        return;
      }
      
      // Calculate correlation matrix
      const correlations = [];
      const highCorrelations = [];
      
      for (let i = 0; i < columnsToAnalyze.length; i++) {
        const col1 = columnsToAnalyze[i];
        
        // Convert column data to numeric
        const col1Data = data[col1]
          .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
          .map(val => parseFloat(val));
        
        if (col1Data.length === 0) continue;
        
        for (let j = 0; j < columnsToAnalyze.length; j++) {
          const col2 = columnsToAnalyze[j];
          
          // Skip self-correlation
          if (i === j) {
            correlations.push({
              x: i,
              y: j,
              z: 1, // Perfect correlation with self
              xName: col1,
              yName: col2,
              correlation: 1
            });
            continue;
          }
          
          // Convert column data to numeric
          const col2Data = data[col2]
            .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
            .map(val => parseFloat(val));
          
          if (col2Data.length === 0) continue;
          
          // Calculate correlation coefficient (Pearson)
          const correlation = calculateCorrelation(col1Data, col2Data);
          
          correlations.push({
            x: i,
            y: j,
            z: Math.abs(correlation), // Use absolute value for bubble size
            xName: col1,
            yName: col2,
            correlation: correlation,
            isPositive: correlation >= 0
          });
          
          // Track high correlations (|r| > 0.7)
          if (Math.abs(correlation) > 0.7 && i < j) {
            highCorrelations.push({
              feature1: col1,
              feature2: col2,
              correlation: correlation
            });
          }
        }
      }
      
      console.log('CorrelationMatrix - Correlation data:', { 
        count: correlations.length,
        sample: correlations.slice(0, 3),
        highCorrelations
      });
      
      setCorrelationData(correlations);
      setHighlightedFeatures(highCorrelations.map(item => [item.feature1, item.feature2]).flat());
      setLoading(false);
    } catch (err) {
      console.error('CorrelationMatrix - Error calculating correlations:', err);
      setError('Error calculating correlations: ' + err.message);
      setLoading(false);
    }
  }, [data, columns, selectedView]);

  // Calculate Pearson correlation coefficient
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
          Calculating correlations...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error || correlationData.length === 0) {
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
          {error || "No correlation data available. Try selecting different features."}
        </Typography>
      </Box>
    );
  }

  // Get unique column names for axis labels
  const uniqueColumns = [...new Set(correlationData.map(item => item.xName))];

  // Custom tooltip for the correlation matrix
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const corrValue = data.correlation.toFixed(2);
      const strength = 
        Math.abs(data.correlation) > 0.7 ? "Strong" :
        Math.abs(data.correlation) > 0.3 ? "Moderate" : "Weak";
      const direction = data.correlation > 0 ? "positive" : "negative";
      
      return (
        <Box sx={{ bgcolor: "#fff", p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {data.xName} vs {data.yName}
          </Typography>
          <Typography variant="body2">
            Correlation: {corrValue}
          </Typography>
          <Typography variant="body2">
            {strength} {direction} relationship
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Get color based on correlation value
  const getColor = (correlation) => {
    if (correlation >= 0.7) return "#4CAF50"; // Strong positive - Green
    if (correlation >= 0.3) return "#8BC34A"; // Moderate positive - Light green
    if (correlation > -0.3) return "#9E9E9E"; // Weak - Gray
    if (correlation > -0.7) return "#FF9800"; // Moderate negative - Orange
    return "#F44336"; // Strong negative - Red
  };

  return (
    <Box sx={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 70, left: 70 }}
        >
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Feature 1" 
            tick={false}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Feature 2" 
            tick={false}
            axisLine={false}
            tickLine={false}
          />
          <ZAxis 
            type="number" 
            dataKey="z" 
            range={[20, 500]} 
            name="Correlation" 
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Correlation" data={correlationData} shape="circle">
            {correlationData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getColor(entry.correlation)}
                stroke={highlightedFeatures.includes(entry.xName) && highlightedFeatures.includes(entry.yName) ? "#000" : "none"}
                strokeWidth={highlightedFeatures.includes(entry.xName) && highlightedFeatures.includes(entry.yName) ? 2 : 0}
              />
            ))}
          </Scatter>
          
          {/* Add column names as labels */}
          {uniqueColumns.map((column, index) => (
            <React.Fragment key={`label-${index}`}>
              {/* X-axis labels */}
              <text 
                x={index * (100 / uniqueColumns.length) + (50 / uniqueColumns.length)}
                y="98%" 
                textAnchor="middle"
                transform={`rotate(-45, ${index * (100 / uniqueColumns.length) + (50 / uniqueColumns.length)}, 98%)`}
                style={{ fontSize: '10px', fill: highlightedFeatures.includes(column) ? '#F44336' : '#666' }}
              >
                {column}
              </text>
              
              {/* Y-axis labels */}
              <text 
                x="2%" 
                y={index * (100 / uniqueColumns.length) + (50 / uniqueColumns.length)}
                textAnchor="middle"
                style={{ fontSize: '10px', fill: highlightedFeatures.includes(column) ? '#F44336' : '#666' }}
              >
                {column}
              </text>
            </React.Fragment>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Add a simple legend */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 1,
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#4CAF50', mr: 0.5, borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Strong +</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#8BC34A', mr: 0.5, borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Moderate +</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#9E9E9E', mr: 0.5, borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Weak</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#FF9800', mr: 0.5, borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Moderate -</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#F44336', mr: 0.5, borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Strong -</Typography>
        </Box>
      </Box>
      
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5, color: '#64748B' }}>
        Larger circles = stronger correlation. Hover for details.
      </Typography>
    </Box>
  );
};

export default CorrelationMatrix; 