import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function TopNavigation({
  isSmallScreen,
  toggleDrawer,
}: {
  isSmallScreen: boolean;
  toggleDrawer: () => void;
}) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {isSmallScreen && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer} // Toggle the drawer when the button is clicked
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Project Manager
        </Typography>
        <Button color="inherit">Daniel</Button>
      </Toolbar>
    </AppBar>
  );
}
