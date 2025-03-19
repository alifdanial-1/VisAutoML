import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { BACKEND_BASE_URL } from "../../config/config.js";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { 
  DialogContent, 
  TextField, 
  Typography, 
  Box, 
  IconButton,
  InputAdornment,
  Paper
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const EditDialog = ({ modelName, open, setOpen }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const csrfToken = Cookies.get("csrftoken");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": csrfToken,
    },
  };

  useEffect(() => {
    if (open) {
      setName(modelName);
      setError('');
    }
  }, [open, modelName]);

  const handleRename = () => {
    if (!name.trim()) {
      setError('Project name cannot be empty');
      return;
    }
    
    dispatch({ type: 'RENAME_MODEL', payload: name });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && name.trim()) {
      handleRename();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
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
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1E293B',
            pt: 3,
            pb: 1
          }}
        >
          Rename Project
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
            fontFamily: "'SF Pro Display', sans-serif",
            fontSize: '0.95rem',
            color: '#64748B',
            mb: 2
          }}
        >
          Enter a new name for your project
        </Typography>
        
        <TextField
          autoFocus
          fullWidth
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Project name"
          variant="outlined"
          error={!!error}
          helperText={error}
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
        <Button
          variant="contained"
          onClick={handleRename}
          disabled={!name.trim()}
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
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
