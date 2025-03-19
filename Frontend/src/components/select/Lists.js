import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";
import { withStyles } from "@mui/styles";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
// import { HelpIcon } from "@mui/icons-material";
import HelpIcon from '@mui/icons-material/Help';

const styles = {
  tooltip: {
    fontSize: '30px',
  },
  MuiTooltip: {
    tooltip: {
      fontSize: '30px',
    },
  },
};

// Define the DraggableElementWithStyles outside of the Lists component
const DraggableElementWithStyles = withStyles({
  tooltip: {
  fontSize: '30px',
},
MuiTooltip: {
  tooltip: {
    fontSize: '30px',
  },
},})(DraggableElement);

const CustomTooltip = withStyles({
  tooltip: {
    minWidth: "450px",
    textAlign: "center",
  }
})(Tooltip);

const HtmlTooltip = withStyles({
  tooltip: {
    minWidth: "450px",
    textAlign: "center",
  }
})(Tooltip);

const Lists = ({ columns, elements, setElements, tooltipId, setTooltipId, dataQualityAlerts }) => {
  const removeFromList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const handleOpen = () => { };

  const handleClose = () => { };


  const addToList = (list, index, element) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  useEffect(() => {
    let initialColumns = [];
    columns.map((column, index) =>
      initialColumns.push({
        id: index.toString(),
        prefix: "Columns not to use",
        content: column,
      })
    );
    setElements({ ...elements, "Columns not to use": initialColumns });
  }, [columns]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (
      (elements["Prediction Column"].length === 1 &&
        result.destination.droppableId === "Prediction Column") ||
      (elements["ID Column"].length === 1 &&
        result.destination.droppableId === "ID Column")
    ) {
      return;
    }
    const listCopy = { ...elements };

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    setElements(listCopy);
  };

  return (
    <Box sx={{ margin: "1em 0 0 0" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2em" }}>
          {/* First Row - Prediction and ID Columns */}
          <Box sx={{ display: "flex", gap: "2em" }}>
            <Box sx={{ width: "50%" }}>
              <Typography sx={{ 
                fontSize: "1.1rem", 
                fontWeight: "600", 
                fontFamily: "'SF Pro Display', sans-serif",
                color: "#1E293B",
                mb: 1
              }}>
                Prediction Column
              </Typography>
              <Typography sx={{ 
                fontSize: "0.9rem", 
                fontFamily: "'SF Pro Display', sans-serif",
                color: "#64748B",
                mb: 1.5
              }}>
                Select the column you want to predict
              </Typography>
              {/* <Box sx={{
                minHeight: "100px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                p: 1
              }}> */}
                <CustomTooltip
                  open={tooltipId === 28}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  title={
                    <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                      <Typography>Select the target variable or the outcome you want your model to predict. This is the main focus of your analysis.</Typography>
                      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(27)}>PREVIOUS</Button>
                        <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(29)}>NEXT</Button>
                      </Box>
                    </Box>
                  }
                  placement="bottom-start"
                  arrow
                >
                  <Box>
                    <DraggableElementWithStyles
                      elements={elements["Prediction Column"]}
                      key={"Prediction Column"}
                      prefix={""}
                      id={"Prediction Column"}
                      dataQualityAlerts={dataQualityAlerts}
                    />
                  </Box>
                </CustomTooltip>
              {/* </Box> */}
            </Box>

            <Box sx={{ width: "50%" }}>
              <Typography sx={{ 
                fontSize: "1.1rem", 
                fontWeight: "600", 
                fontFamily: "'SF Pro Display', sans-serif",
                color: "#1E293B",
                mb: 1
              }}>
                ID Column
              </Typography>
              <Typography sx={{ 
                fontSize: "0.9rem", 
                fontFamily: "'SF Pro Display', sans-serif",
                color: "#64748B",
                mb: 1.5
              }}>
                Select a unique identifier column
              </Typography>
              {/* <Box sx={{
                minHeight: "100px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                p: 1
              }}> */}
                <CustomTooltip
                  open={tooltipId === 29}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  title={
                    <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                      <Typography>Choose one column that contains unique identifiers for your data entries.</Typography>
                      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(28)}>PREVIOUS</Button>
                        <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(30)}>NEXT</Button>
                      </Box>
                    </Box>
                  }
                  placement="right"
                  arrow
                >
                  <Box>
                    <DraggableElementWithStyles
                      elements={elements["ID Column"]}
                      key={"ID Column"}
                      prefix={""}
                      id={"ID Column"}
                      dataQualityAlerts={dataQualityAlerts}
                    />
                  </Box>
                </CustomTooltip>
              {/* </Box> */}
            </Box>
          </Box>

          {/* Second Row - Columns to use and not to use */}
          <Box sx={{ display: "flex", gap: "2em" }}>
            <Box sx={{ width: "50%" }}>
              <Typography sx={{ 
                fontSize: "1.1rem", 
                fontWeight: "600", 
                fontFamily: "'SF Pro Display', sans-serif",
                color: "#1E293B",
                mb: 1
              }}>
                Columns Not to Use
              </Typography>
              <Typography sx={{ 
                fontSize: "0.9rem", 
                fontFamily: "'SF Pro Display', sans-serif",
                color: "#64748B",
                mb: 1.5
              }}>
                Select columns to exclude
              </Typography>
              {/* <Box sx={{
                minHeight: "350px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                p: 1,
                overflowY: "auto",
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              }}> */}
                <CustomTooltip
                  open={tooltipId === 30 || tooltipId === 31}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  title={
                    tooltipId === 30 ? (
                      <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                        <Typography>Omit columns that are irrelevant to the prediction.</Typography>
                        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(29)}>PREVIOUS</Button>
                          <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(31)}>NEXT</Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                        <Typography>{"Data leakage causes the model to learn from information it shouldn't have access to."}</Typography>
                        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(30)}>PREVIOUS</Button>
                          <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(32)}>NEXT</Button>
                        </Box>
                      </Box>
                    )
                  }
                  placement="bottom-start"
                  arrow
                >
                  <Box>
                    <DraggableElementWithStyles
                      elements={elements["Columns not to use"]}
                      key={"Columns not to use"}
                      prefix={""}
                      id={"Columns not to use"}
                      dataQualityAlerts={dataQualityAlerts}
                    />
                  </Box>
                </CustomTooltip>
              {/* </Box> */}
            </Box>

            <Box sx={{ width: "50%" }}>
              <Typography sx={{ 
                fontSize: "1.1rem", 
                fontWeight: "600", 
                fontFamily: "'SF Pro Display', sans-serif",
                color: "#1E293B",
                mb: 1
              }}>
                Columns to Use
              </Typography>
              <Typography sx={{ 
                fontSize: "0.9rem", 
                fontFamily: "'SF Pro Display', sans-serif",
                color: "#64748B",
                mb: 1.5
              }}>
                Select columns for model training
              </Typography>
              {/* <Box sx={{
                minHeight: "350px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                p: 1,
                overflowY: "auto",
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              }}> */}
                <CustomTooltip
                  open={tooltipId === 27}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  title={
                    <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                      <Typography>Fine-tune your model's input. Drag and drop columns to select which features to use.</Typography>
                      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(26)}>PREVIOUS</Button>
                        <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(28)}>NEXT</Button>
                      </Box>
                    </Box>
                  }
                  placement="left"
                  arrow
                >
                  <Box>
                    <DraggableElementWithStyles
                      elements={elements["Columns to use"]}
                      key={"Columns to use"}
                      prefix={""}
                      id={"Columns to use"}
                      dataQualityAlerts={dataQualityAlerts}
                    />
                  </Box>
                </CustomTooltip>
              {/* </Box> */}
            </Box>
          </Box>
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default Lists;
