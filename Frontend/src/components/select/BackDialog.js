import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";

const BackDialog = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    setOpen(false);
    navigate("/review");
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '12px',
          padding: '8px'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          fontFamily: "SF Pro, -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: '1.25rem',
          fontWeight: 500,
          color: '#1a1a1a',
          padding: '16px 24px'
        }}
      >
        Discard unsaved changes?
      </DialogTitle>
      <DialogActions sx={{ padding: '12px 24px 20px' }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            fontFamily: "SF Pro, -apple-system, BlinkMacSystemFont, sans-serif",
            textTransform: 'none',
            fontWeight: 500,
            minWidth: '80px'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          color="error"
          sx={{ 
            fontFamily: "SF Pro, -apple-system, BlinkMacSystemFont, sans-serif",
            textTransform: 'none',
            fontWeight: 500,
            minWidth: '80px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
        >
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BackDialog;
