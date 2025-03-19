import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ScatterChart,
  Scatter,
  Cell,
  Legend
} from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';

const MissingValuesHeatmap = ({ data, columns, selectedView = 'all', height = 200, hideSummary = false }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [missingCounts, setMissingCounts] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [processedData, setProcessedData] = useState(null);

  // First, process and normalize the data
  useEffect(() => {
    console.log('MissingValuesHeatmap - Initializing with:', { 
      dataExists: !!data, 
      columnsExist: !!columns, 
      columnsLength: columns?.length,
      selectedView,
      dataType: typeof data,
      columnsType: typeof columns
    });
    
    setLoading(true);
    setError(null);
    
    try {
      if (!data || !columns || columns.length === 0) {
        console.log('MissingValuesHeatmap - Missing data or columns');
        setError('No data available');
        setLoading(false);
        return;
      }
      
      // Debug data structure
      if (data) {
        console.log('MissingValuesHeatmap - Data structure:', {
          keys: Object.keys(data).slice(0, 5),
          sampleColumn: columns && columns.length > 0 ? columns[0] : null,
          sampleData: columns && columns.length > 0 && data[columns[0]] ? data[columns[0]].slice(0, 5) : null
        });
      }
      
      // Normalize data structure
      const normalizedData = {};
      let dataIsValid = false;
      
      // Check if data is already in the expected format (column -> array of values)
      if (typeof data === 'object' && !Array.isArray(data)) {
        const sampleColumn = columns[0];
        if (data[sampleColumn] && Array.isArray(data[sampleColumn])) {
          console.log('MissingValuesHeatmap - Data is already in the expected format');
          normalizedData.data = data;
          dataIsValid = true;
        }
      }
      
      // If data is not in the expected format, try to convert it
      if (!dataIsValid) {
        console.log('MissingValuesHeatmap - Attempting to normalize data structure');
        
        // If data is an array of objects (rows)
        if (Array.isArray(data)) {
          console.log('MissingValuesHeatmap - Data is an array of objects, converting to columns');
          
          // Convert rows to columns
          columns.forEach(column => {
            normalizedData[column] = data.map(row => row[column]);
          });
          
          dataIsValid = true;
        } 
        // If data is in some other format, we can't process it
        else {
          console.error('MissingValuesHeatmap - Unable to process data format');
          setError('Unsupported data format');
          setLoading(false);
          return;
        }
      } else {
        normalizedData.data = data;
      }
      
      setProcessedData(normalizedData.data || normalizedData);
      setLoading(false);
    } catch (err) {
      console.error('MissingValuesHeatmap - Error processing data:', err);
      setError('Error processing data: ' + err.message);
      setLoading(false);
    }
  }, [data, columns]);
  
  // Then, generate the heatmap data
  useEffect(() => {
    if (!processedData || !columns || columns.length === 0 || loading) {
      return;
    }
    
    console.log('MissingValuesHeatmap - Generating heatmap with processed data');
    setLoading(true);
    
    try {
      // Determine which columns to display
      const columnsToDisplay = selectedView === 'all' 
        ? columns 
        : [selectedView];
      
      console.log('MissingValuesHeatmap - Columns to display:', columnsToDisplay);
      
      // Check if columns exist in data
      const missingColumns = columnsToDisplay.filter(column => !processedData[column]);
      if (missingColumns.length > 0) {
        console.warn('MissingValuesHeatmap - Some columns not found in data:', missingColumns);
      }
      
      // Count missing values for each column
      const missingValueCounts = {};
      let maxRows = 0;
      
      columnsToDisplay.forEach(column => {
        if (processedData[column]) {
          const columnData = processedData[column];
          maxRows = Math.max(maxRows, columnData.length);
          
          const missingCount = columnData.filter(val => 
            val === null || val === undefined || val === '' || 
            (typeof val === 'string' && val.trim() === '')
          ).length;
          
          missingValueCounts[column] = {
            count: missingCount,
            percentage: columnData.length > 0 ? (missingCount / columnData.length) * 100 : 0
          };
          
          console.log(`MissingValuesHeatmap - Column '${column}' analysis:`, {
            total: columnData.length,
            missing: missingCount,
            percentage: columnData.length > 0 ? (missingCount / columnData.length) * 100 : 0
          });
        }
      });
      
      setTotalRows(maxRows);
      setMissingCounts(missingValueCounts);
      
      // Create heatmap data points
      const heatmapPoints = [];
      
      columnsToDisplay.forEach((column, colIndex) => {
        if (processedData[column]) {
          const columnData = processedData[column];
          
          // For single column view, show each missing value
          if (selectedView !== 'all') {
            console.log(`MissingValuesHeatmap - Processing single column '${column}' with ${columnData.length} rows`);
            
            columnData.forEach((value, rowIndex) => {
              const isMissing = value === null || value === undefined || value === '' || 
                               (typeof value === 'string' && value.trim() === '');
              
              if (isMissing) {
                heatmapPoints.push({
                  x: 0,  // Only one column
                  y: rowIndex,
                  isMissing: true,
                  column,
                  row: rowIndex
                });
              }
            });
          } 
          // For all columns view, sample the data to avoid too many points
          else {
            console.log(`MissingValuesHeatmap - Processing column '${column}' for overview`);
            
            // For overview, create a grid of cells representing chunks of data
            const chunkSize = Math.max(1, Math.ceil(columnData.length / 20)); // Show at most 20 chunks per column
            console.log(`MissingValuesHeatmap - Using chunk size of ${chunkSize} for column '${column}'`);
            
            for (let i = 0; i < columnData.length; i += chunkSize) {
              const chunk = columnData.slice(i, i + chunkSize);
              const missingInChunk = chunk.filter(val => 
                val === null || val === undefined || val === '' || 
                (typeof val === 'string' && val.trim() === '')
              ).length;
              
              const missingPercentage = chunk.length > 0 ? missingInChunk / chunk.length : 0;
              
              if (missingPercentage > 0) {
                heatmapPoints.push({
                  x: colIndex,
                  y: Math.floor(i / chunkSize),
                  value: missingPercentage,
                  isMissing: true,
                  column,
                  startRow: i,
                  endRow: Math.min(i + chunkSize - 1, columnData.length - 1),
                  missingCount: missingInChunk,
                  totalCount: chunk.length
                });
              }
            }
          }
        }
      });
      
      console.log('MissingValuesHeatmap - Generated data points:', { 
        count: heatmapPoints.length,
        sample: heatmapPoints.slice(0, 3)
      });
      
      setHeatmapData(heatmapPoints);
      setLoading(false);
    } catch (err) {
      console.error('MissingValuesHeatmap - Error creating heatmap:', err);
      setError('Error creating heatmap: ' + err.message);
      setLoading(false);
    }
  }, [processedData, columns, selectedView]);

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
          Generating missing values heatmap...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error || !processedData || heatmapData.length === 0) {
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
          {error || (!processedData 
            ? "No data available" 
            : heatmapData.length === 0 
              ? "No missing values found" 
              : "Cannot create heatmap")}
        </Typography>
      </Box>
    );
  }

  // Summary of missing values
  const MissingSummary = () => {
    const columnsWithMissing = Object.entries(missingCounts)
      .filter(([_, info]) => info.count > 0)
      .sort((a, b) => b[1].percentage - a[1].percentage);
    
    if (columnsWithMissing.length === 0) {
      return (
        <Typography variant="body2" sx={{ mt: 1, color: "#64748B" }}>
          No missing values found in the selected columns.
        </Typography>
      );
    }
    
    return (
      <Box sx={{ mt: 1, fontSize: '0.75rem' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: "#64748B" }}>
          Missing values summary:
        </Typography>
        {columnsWithMissing.slice(0, 3).map(([column, info]) => (
          <Typography key={column} variant="caption" sx={{ display: 'block', color: "#64748B" }}>
            {column}: {info.count} missing ({info.percentage.toFixed(1)}%)
          </Typography>
        ))}
        {columnsWithMissing.length > 3 && (
          <Typography variant="caption" sx={{ display: 'block', color: "#64748B" }}>
            ...and {columnsWithMissing.length - 3} more columns with missing values
          </Typography>
        )}
      </Box>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      if (selectedView !== 'all') {
        return (
          <Box sx={{ bgcolor: "#fff", p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
            <Typography variant="body2">Column: {data.column}</Typography>
            <Typography variant="body2">Row: {data.row + 1}</Typography>
            <Typography variant="body2">Value: Missing</Typography>
          </Box>
        );
      } else {
        return (
          <Box sx={{ bgcolor: "#fff", p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
            <Typography variant="body2">Column: {data.column}</Typography>
            <Typography variant="body2">Rows: {data.startRow + 1} - {data.endRow + 1}</Typography>
            <Typography variant="body2">Missing: {data.missingCount} of {data.totalCount} ({(data.value * 100).toFixed(1)}%)</Typography>
          </Box>
        );
      }
    }
    return null;
  };

  // Calculate domain for axes
  const getXDomain = () => {
    if (selectedView !== 'all') {
      return [-0.5, 0.5]; // Single column
    }
    return [-0.5, columns.length - 0.5]; // All columns
  };

  const getYDomain = () => {
    if (selectedView !== 'all') {
      // For single column, show individual rows
      const maxRow = Math.max(...heatmapData.map(d => d.y), 0);
      return [-0.5, maxRow + 0.5];
    } else {
      // For all columns, show chunks
      const maxChunk = Math.max(...heatmapData.map(d => d.y), 0);
      return [-0.5, maxChunk + 0.5];
    }
  };

  // Get color based on missing value percentage
  const getColor = (value) => {
    // Color scale from light yellow to dark red
    if (value <= 0.25) return "#FFEB3B"; // Light yellow
    if (value <= 0.5) return "#FFC107";  // Amber
    if (value <= 0.75) return "#FF9800"; // Orange
    return "#F44336";                    // Red
  };

  // console.log('MissingValuesHeatmap - Rendering with data:', {
  //   points: heatmapData.length,
  //   xDomain: getXDomain(),
  //   yDomain: getYDomain()
  // });

  return (
    <Box sx={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height={hideSummary ? "100%" : "85%"}>
        <ScatterChart
          margin={{ top: 10, right: 10, bottom: 30, left: selectedView !== 'all' ? 10 : 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          {selectedView === 'all' && (
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Column" 
              domain={getXDomain()}
              tickCount={Math.min(columns.length, 10)}
              tick={false}
              label={{ value: 'Columns', position: 'bottom', offset: 10 }}
            />
          )}
          
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Row" 
            domain={getYDomain()}
            tickCount={10}
            tick={false}
            label={{ value: selectedView !== 'all' ? 'Rows with missing values' : 'Data chunks', angle: -90, position: 'left' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Scatter 
            name="Missing Values" 
            data={heatmapData} 
            fill="#F44336"
            shape="square"
          >
            {heatmapData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={selectedView !== 'all' ? "#F44336" : getColor(entry.value)}
                opacity={selectedView !== 'all' ? 0.8 : entry.value}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {!hideSummary && <MissingSummary />}
    </Box>
  );
};

export default MissingValuesHeatmap; 