import { ComponentPropsWithRef } from "react";
import Spinner from "react-bootstrap/Spinner";

export default function LoadingSpinner(
  props: ComponentPropsWithRef<typeof Spinner>
) {
  return (
    <Spinner {...props} animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
