import { Button, Modal } from "react-bootstrap";

interface ConfirmationProps {
    showDeleteModal: boolean;
    handleDelete: () => void;
    handleCancel: () => void;
}

export default function ConfirmDeleteModal({ showDeleteModal, handleDelete, handleCancel }: ConfirmationProps) {
  return (
    <Modal show={showDeleteModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
