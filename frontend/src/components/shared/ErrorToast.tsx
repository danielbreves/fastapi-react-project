import { Snackbar, IconButton, Typography, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";

interface ToastProps {
  message: string;
  handleClose: () => void;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

export default function ErrorToast({
  message,
  handleClose,
  position = { vertical: "top", horizontal: "right" },
}: ToastProps) {
  return (
    <Snackbar
      anchorOrigin={position}
      open={!!message}
      autoHideDuration={3000}
      onClose={handleClose}
      message={
        <div style={{ display: "flex", alignItems: "center" }}>
          <ErrorIcon color="error" style={{ marginRight: "8px" }} />
          <Typography variant="body1">{message}</Typography>
        </div>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
