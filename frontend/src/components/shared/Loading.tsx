import { ComponentPropsWithRef } from "react";
import { Box, CircularProgress, LinearProgress } from "@mui/material";

export default function Loading(
  props: ComponentPropsWithRef<typeof CircularProgress>
) {
  return (
    <Box sx={{  mt: 3 }}>
      <LinearProgress {...props} />
    </Box>
  );
}
