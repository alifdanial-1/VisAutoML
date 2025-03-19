import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';

const HistogramChart = ({ data, feature, height = 200 }) => {
  const [histogramData, setHistogramData] = useState([]);
  const [statistics, setStatistics] = useState({
    mean: 0,
    median: 0,
    min: 0,
    max: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    console.log('HistogramChart - Data received:', { feature, dataExists: !!data, featureExists: data && !!data[feature] });
    
    try {
      if (!data || !feature) {
        console.log('HistogramChart - Missing data or feature');
        setLoading(false);
        return;
      }

      if (!data[feature]) {
        console.log(`HistogramChart - Feature '${feature}' not found in data`);
        setError(`Feature '${feature}' not found in data`);
        setLoading(false);
        return;
      }

      // Process the data for the histogram
      const featureData = data[feature];
      console.log(`HistogramChart - Feature data for '${feature}':`, { 
        length: featureData.length,
        sample: featureData.slice(0, 5),
        type: typeof featureData[0]
      });
      
      // Check if we have data
      if (!Array.isArray(featureData) || featureData.length === 0) {
        console.log('HistogramChart - No data available for this feature');
        setError('No data available for this feature');
        setLoading(false);
        return;
      }
      
      // Calculate basic statistics
      const numericData = featureData
        .filter(val => val !== null && val !== undefined && !isNaN(parseFloat(val)) && isFinite(val))
        .map(val => parseFloat(val));
      
      console.log('HistogramChart - Numeric data:', { 
        length: numericData.length,
        sample: numericData.slice(0, 5)
      });
      
      if (numericData.length === 0) {
        console.log('HistogramChart - Cannot create histogram for non-numeric data');
        setError('Cannot create histogram for non-numeric data');
        setLoading(false);
        return;
      }
      
      // Sort data for median calculation
      const sortedData = [...numericData].sort((a, b) => a - b);
      
      // Calculate statistics
      const min = Math.min(...numericData);
      const max = Math.max(...numericData);
      
      console.log('HistogramChart - Data range:', { min, max });
      
      // Check if min and max are the same (constant value)
      if (min === max) {
        console.log('HistogramChart - Constant value detected');
        setHistogramData([{ bin: min.toString(), count: numericData.length, binStart: min, binEnd: max }]);
        setStatistics({
          mean: min,
          median: min,
          min: min,
          max: max
        });
        setLoading(false);
        return;
      }
      
      const sum = numericData.reduce((acc, val) => acc + val, 0);
      const mean = sum / numericData.length;
      
      // Calculate median
      let median;
      const midIndex = Math.floor(sortedData.length / 2);
      if (sortedData.length % 2 === 0) {
        median = (sortedData[midIndex - 1] + sortedData[midIndex]) / 2;
      } else {
        median = sortedData[midIndex];
      }
      
      const stats = {
        mean: parseFloat(mean.toFixed(2)),
        median: parseFloat(median.toFixed(2)),
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2))
      };
      
      console.log('HistogramChart - Statistics:', stats);
      setStatistics(stats);
      
      // Create histogram bins
      // Use Sturges' formula for bin count: k = ceil(log2(n) + 1)
      const binCount = Math.min(10, Math.ceil(Math.log2(numericData.length) + 1));
      const binWidth = (max - min) / binCount;
      
      console.log('HistogramChart - Bin configuration:', { binCount, binWidth });
      
      const bins = Array(binCount).fill(0);
      
      // Count values in each bin
      numericData.forEach(value => {
        const binIndex = Math.min(
          Math.floor((value - min) / binWidth),
          binCount - 1
        );
        bins[binIndex]++;
      });
      
      // Create data for the chart
      const histData = bins.map((count, index) => {
        const binStart = min + index * binWidth;
        const binEnd = binStart + binWidth;
        return {
          bin: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
          count,
          binStart,
          binEnd
        };
      });
      
      console.log('HistogramChart - Histogram data:', histData);
      setHistogramData(histData);
      setLoading(false);
    } catch (err) {
      console.error('HistogramChart - Error creating histogram:', err);
      setError('Error creating histogram: ' + err.message);
      setLoading(false);
    }
  }, [data, feature]);

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
          Generating histogram...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error || !data || !feature || !data[feature] || histogramData.length === 0) {
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
          {error || (!data || !feature 
            ? "No data available" 
            : !data[feature] 
              ? `Feature '${feature}' not found in data` 
              : "Cannot create histogram for this feature type")}
        </Typography>
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { binStart, binEnd, count } = payload[0].payload;
      return (
        <Box sx={{ bgcolor: "#fff", p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
          <Typography variant="body2">Range: {binStart.toFixed(2)} - {binEnd.toFixed(2)}</Typography>
          <Typography variant="body2">Count: {count}</Typography>
          <Typography variant="body2">Percentage: {((count / data[feature].length) * 100).toFixed(1)}%</Typography>
        </Box>
      );
    }
    return null;
  };

  // Find the bin index for mean and median
  const getMeanBinIndex = () => {
    const meanBin = histogramData.findIndex(item => 
      item.binStart <= statistics.mean && statistics.mean <= item.binEnd
    );
    return meanBin >= 0 ? meanBin : undefined;
  };

  const getMedianBinIndex = () => {
    const medianBin = histogramData.findIndex(item => 
      item.binStart <= statistics.median && statistics.median <= item.binEnd
    );
    return medianBin >= 0 ? medianBin : undefined;
  };

  return (
    <Box sx={{ width: '100%', height: height }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" sx={{ color: "#64748B" }}>
          Min: {statistics.min} | Max: {statistics.max}
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748B" }}>
          Mean: {statistics.mean} | Median: {statistics.median}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={histogramData}
          margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="bin" 
            angle={-45} 
            textAnchor="end" 
            height={50} 
            tick={{ fontSize: 10 }} 
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#000" />
          <ReferenceLine y={0} stroke="#000" />
          {getMeanBinIndex() !== undefined && (
            <ReferenceLine 
              x={getMeanBinIndex()} 
              stroke="red" 
              strokeDasharray="3 3"
              label={{ value: 'Mean', position: 'top', fill: 'red', fontSize: 10 }} 
            />
          )}
          {getMedianBinIndex() !== undefined && getMedianBinIndex() !== getMeanBinIndex() && (
            <ReferenceLine 
              x={getMedianBinIndex()} 
              stroke="blue" 
              strokeDasharray="3 3"
              label={{ value: 'Median', position: 'top', fill: 'blue', fontSize: 10 }} 
            />
          )}
          <Bar 
            dataKey="count" 
            fill="#8884d8" 
            name="Frequency" 
            barSize={30}
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default HistogramChart; 