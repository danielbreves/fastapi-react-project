import { ReactNode } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";

interface SlideOverProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: ReactNode;
}

export default function SlideOver({
  show,
  onHide,
  title,
  children,
}: SlideOverProps) {
  return (
    <>
      <Offcanvas show={show} placement="end" onHide={onHide}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{children}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
