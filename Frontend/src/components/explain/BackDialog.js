import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useNavigate } from "react-router-dom";

const BackDialog = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    setOpen(false);
    navigate("/home");
  };

  const sfProFont = "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif";

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '12px',
          padding: '8px',
          fontFamily: sfProFont
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          fontFamily: sfProFont,
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1a1a1a',
          padding: '16px 24px 8px',
          letterSpacing: '-0.01em'
        }}
      >
        Return to Home?
      </DialogTitle>
      <DialogContent sx={{ padding: '0 24px' }}>
        <DialogContentText
          sx={{
            fontFamily: sfProFont,
            fontSize: '0.95rem',
            color: '#64748B',
            letterSpacing: '-0.01em',
            lineHeight: 1.5
          }}
        >
          You'll leave the current model explanation view and return to the home page.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px 20px' }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            fontFamily: sfProFont,
            textTransform: 'none',
            fontWeight: 500,
            minWidth: '80px',
            color: '#64748B',
            letterSpacing: '-0.01em',
            fontSize: '0.9375rem'
          }}
        >
          Stay Here
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          color="primary"
          sx={{ 
            fontFamily: sfProFont,
            textTransform: 'none',
            fontWeight: 500,
            minWidth: '80px',
            boxShadow: 'none',
            backgroundColor: '#2563EB',
            letterSpacing: '-0.01em',
            fontSize: '0.9375rem',
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: '#1D4ED8'
            }
          }}
        >
          Return Home
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BackDialog;
