import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useDialogStore } from '../store/dialogStore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function GlobalDialog() {
  const { open, title, message, onConfirm, closeDialog } = useDialogStore();

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      sx={{ '& .MuiPaper-root': { borderRadius: 3, p: 2, minWidth: 350 } }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button
          onClick={closeDialog}
          color="secondary"
          variant="outlined"
          startIcon={<CancelIcon />}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            closeDialog();
          }}
          color="primary"
          variant="contained"
          startIcon={<CheckCircleIcon />}
          sx={{ borderRadius: 2, boxShadow: 2 }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
