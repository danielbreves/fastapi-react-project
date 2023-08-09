import { ComponentPropsWithRef } from "react";
import { CircularProgress } from '@mui/material';

export default function LoadingSpinner(
  props: ComponentPropsWithRef<typeof CircularProgress>
) {
  return (
    <CircularProgress {...props}>
      <span className="visually-hidden">Loading...</span>
    </CircularProgress>
  );
}
