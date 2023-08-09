import {
  List,
  ListItemText,
  Drawer,
  ListItemButton,
  Box,
  Toolbar,
} from "@mui/material";

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
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItemButton href="/home">
            <ListItemText primary="Projects" />
          </ListItemButton>
          <ListItemButton href="/about">
            <ListItemText primary="About" />
          </ListItemButton>
          <ListItemButton href="/contact">
            <ListItemText primary="Contact" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
