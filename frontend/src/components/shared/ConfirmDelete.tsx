import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmationProps {
  showDeleteModal: boolean;
  handleDelete: () => void;
  handleCancel: () => void;
}

export default function ConfirmDeleteModal({
  showDeleteModal,
  handleDelete,
  handleCancel,
}: ConfirmationProps) {
  return (
    <Dialog open={showDeleteModal} onClose={handleCancel}>
      <DialogTitle>Confirm delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
