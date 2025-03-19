import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Tooltip, Typography, Paper, IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { modelValidator } from "../validation/newModelValidation";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from "react-redux";
import { addNewModel } from "../../actions/modelAction";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { tooltipClasses } from '@mui/material/Tooltip';
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { withStyles } from "@mui/styles";

// Sample images for regression and classification
// Replace these with actual image imports
import regressionImage from "../../static/images/numbers.webp";
import classificationImage from "../../static/images/spam-modified.png";

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

const NewModelDialog = ({ open, setOpen, name, type, setName, setType, tooltipId, setTooltipId }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      const newErrors = {...errors};
      delete newErrors.name;
      setErrors(newErrors);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const { isValid, validationErrors } = modelValidator({
      name: name,
      type: type,
    });
    if (isValid) {
      dispatch(addNewModel(name, type));
      setOpen(false);
      navigate("/dataset");
    } else {
      setErrors(validationErrors);
    }
  };

  const handleTooltipOpen = () => { };
  const handleTooltipClose = () => { };

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
    const newErrors = {...errors};
    delete newErrors.type;
    setErrors(newErrors);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperComponent={props => (
        <Paper 
          {...props} 
          sx={{ 
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)'
          }}
        />
      )}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle 
          sx={{ 
            fontFamily: "'SF Pro Display', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1E293B',
            pt: 3,
            pb: 1
          }}
        >
          New Model
        </DialogTitle>
        
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#64748B',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: '#1E293B'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 1, pb: 3 }}>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 400,
            fontFamily: "'SF Pro Display', sans-serif",
            color: '#64748B',
            mb: 4
          }}
        >
          Create a machine learning model by defining what you want to predict
        </Typography>

        {/* Model Name Section */}
        <CustomTooltip
          open={tooltipId === 6 ? true : false}
          onOpen={handleTooltipOpen}
          onClose={handleTooltipClose}
          title={
            <Box padding="10px" display="flex" flexDirection="column" gap="10px">
              <Typography>Give a name for your machine learning model - it can be
                changed anytime during the development process.</Typography>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(5)}>PREVIOUS</Button>
                <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(7)}>NEXT</Button>
              </Box>
            </Box>
          }
          placement="top"
          arrow
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 600,
                fontFamily: "'SF Pro Display', sans-serif",
                color: '#1E293B',
                mb: 1.5
              }}
            >
              Model Name
            </Typography>
            <TextField
              autoFocus
              id="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter a name for your model"
              fullWidth
              variant="outlined"
              error={errors && errors.name ? true : false}
              helperText={errors && errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EditIcon sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
                sx: {
                  fontFamily: "'SF Pro Display', sans-serif",
                  fontSize: '1rem',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.12)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.24)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563EB'
                  }
                }
              }}
              FormHelperTextProps={{
                sx: {
                  fontFamily: "'SF Pro Display', sans-serif",
                  fontSize: '0.8rem',
                  mt: 1
                }
              }}
            />
          </Box>
        </CustomTooltip>

        {/* What are you trying to predict section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 600,
                fontFamily: "'SF Pro Display', sans-serif",
                color: '#1E293B'
              }}
            >
              What are you trying to predict?
            </Typography>
            <HtmlTooltip 
              placement="right"
              title={
                <React.Fragment>
                  <Typography 
                    sx={{ 
                      fontWeight: "bold", 
                      fontFamily: "'SF Pro Display', sans-serif", 
                      fontSize: "1rem",
                      mb: 1.5
                    }}
                  >
                    Choosing the right prediction type
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      sx={{ 
                        fontWeight: 600,
                        color: '#2563EB',
                        mb: 0.5
                      }}
                    >
                      Numerical Values (Regression):
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', mb: 1 }}>
                      Predicts continuous numbers like prices, temperatures, or ages.
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Example: "What will the house price be?"
                    </Typography>
                  </Box>
                  <Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 600,
                        color: '#2563EB',
                        mb: 0.5
                      }}
                    >
                      Categorical Values (Classification):
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', mb: 1 }}>
                      Predicts categories or classes like yes/no, spam/not spam.
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Example: "Will it rain tomorrow?"
                    </Typography>
                  </Box>
                </React.Fragment>
              }
            >
              <InfoIcon 
                fontSize="small" 
                sx={{ 
                  ml: 1,
                  color: "#64748B",
                  cursor: 'pointer'
                }} 
              />
            </HtmlTooltip>
          </Box>
          
          {errors && errors.type && (
            <Typography 
              sx={{ 
                color: '#d32f2f', 
                fontSize: '0.8rem', 
                fontFamily: "'SF Pro Display', sans-serif",
                mb: 1
              }}
            >
              {errors.type}
            </Typography>
          )}

          {/* Image Selection Cards */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3,
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            {/* Regression Card */}
            <CustomTooltip
              open={tooltipId === 7 ? true : false}
              onOpen={handleTooltipOpen}
              onClose={handleTooltipClose}
              title={
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>If you intend to predict numerical values like temperatures
                    and prices, it is a regression learning task.</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(6)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(8)}>NEXT</Button>
                  </Box>
                </Box>
              }
              placement="top"
              arrow
            >
              <Paper
                onClick={() => handleTypeSelect("Regression")}
                sx={{
                  flex: 1,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: type === "Regression" 
                    ? '2px solid #2563EB' 
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  boxShadow: type === "Regression"
                    ? '0 4px 12px rgba(37, 99, 235, 0.2)'
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transform: type === "Regression" ? 'translateY(-2px)' : 'none',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: '160px',
                    backgroundImage: `url(${regressionImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      fontFamily: "'SF Pro Display', sans-serif",
                      color: '#1E293B',
                      mb: 0.5
                    }}
                  >
                    Numerical Values
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontFamily: "'SF Pro Display', sans-serif",
                      color: '#64748B',
                      mb: 1
                    }}
                  >
                    Regression
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontFamily: "'SF Pro Display', sans-serif",
                      color: '#64748B',
                      lineHeight: 1.4
                    }}
                  >
                    Predicts continuous numbers like prices, temperatures, or ages.
                  </Typography>
                </Box>
              </Paper>
            </CustomTooltip>

            {/* Classification Card */}
            <CustomTooltip
              open={tooltipId === 8 ? true : false}
              onOpen={handleTooltipOpen}
              onClose={handleTooltipClose}
              title={
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>If you intend to predict categorical values like spam or not
                    spam, it is a classification learning task.</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(7)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(9)}>NEXT</Button>
                  </Box>
                </Box>
              }
              placement="top"
              arrow
            >
              <Paper
                onClick={() => handleTypeSelect("Classification")}
                sx={{
                  flex: 1,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: type === "Classification" 
                    ? '2px solid #2563EB' 
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  boxShadow: type === "Classification"
                    ? '0 4px 12px rgba(37, 99, 235, 0.2)'
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transform: type === "Classification" ? 'translateY(-2px)' : 'none',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: '160px',
                    backgroundImage: `url(${classificationImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      fontFamily: "'SF Pro Display', sans-serif",
                      color: '#1E293B',
                      mb: 0.5
                    }}
                  >
                    Categorical Values
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontFamily: "'SF Pro Display', sans-serif",
                      color: '#64748B',
                      mb: 1
                    }}
                  >
                    Classification
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontFamily: "'SF Pro Display', sans-serif",
                      color: '#64748B',
                      lineHeight: 1.4
                    }}
                  >
                    Predicts categories or classes like yes/no, spam/not spam.
                  </Typography>
                </Box>
              </Paper>
            </CustomTooltip>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ 
            fontFamily: "'SF Pro Display', sans-serif",
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            py: 1,
            fontWeight: 500,
            borderColor: 'rgba(0, 0, 0, 0.12)',
            color: '#64748B',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.24)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Cancel
        </Button>
        <CustomTooltip
          open={tooltipId === 9 ? true : false}
          onOpen={handleTooltipOpen}
          onClose={handleTooltipClose}
          title={
            <Box padding="10px" display="flex" flexDirection="column" gap="10px">
              <Typography>Once you are done, click on Create to begin the next step.</Typography>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(8)}>PREVIOUS</Button>
                <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(10)}>OKAY</Button>
              </Box>
            </Box>
          }
          placement="left"
          arrow
        >
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!name.trim() || !type}
            sx={{ 
              fontFamily: "'SF Pro Display', sans-serif",
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              py: 1,
              fontWeight: 600,
              backgroundColor: '#2563EB',
              '&:hover': {
                backgroundColor: '#1D4ED8'
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(37, 99, 235, 0.5)',
                color: 'white'
              }
            }}
          >
            Create
          </Button>
        </CustomTooltip>
      </DialogActions>
    </Dialog>
  );
};

export default NewModelDialog;
