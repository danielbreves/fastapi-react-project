import React from "react";
import { Drawer, Typography, IconButton, Box, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SlideOverProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlideOver({
  show,
  onHide,
  title,
  children,
}: SlideOverProps) {
  return (
    <Drawer
      anchor="right"
      open={show}
      onClose={onHide}
    >
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 5,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onHide} color="inherit" aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ ml: 5, mr: 5 }}>{children}</Box>
    </Drawer>
  );
}
