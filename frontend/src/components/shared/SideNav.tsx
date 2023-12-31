import {
  List,
  ListItemText,
  Drawer,
  ListItemButton,
  Box,
  Toolbar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const drawerWidth = 240;

export default function SideNav({
  isSmallScreen,
  drawerOpen,
  toggleDrawer,
}: {
  isSmallScreen: boolean;
  drawerOpen: boolean;
  toggleDrawer: () => void;
}) {
  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "permanent"}
      open={drawerOpen}
      onClose={isSmallScreen ? toggleDrawer : undefined}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItemButton component={RouterLink} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton component={RouterLink} to="/projects">
            <ListItemText primary="Projects" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
