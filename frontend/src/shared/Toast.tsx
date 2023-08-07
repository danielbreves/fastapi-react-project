import { ToastContainer } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import { FaCircleXmark } from "react-icons/fa6";

interface ToastProps {
  message: string;
  handleClose: () => void;
  position?: "top-end" | "top-start" | "top-center";
}

export default function ErrorToast({
  message,
  handleClose,
  position,
}: ToastProps) {
  return (
    <ToastContainer
      position={position}
      className={position ? undefined : "position-static"}
      style={{ zIndex: 1 }}
    >
      <Toast
        style={{ marginBottom: "20px", boxShadow: "none" }}
        show={!!message}
        onClose={handleClose}
        delay={3000}
        autohide
      >
        <Toast.Body>
          <FaCircleXmark
            style={{ marginRight: "5px", color: "var(--bs-red)" }}
          />
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
