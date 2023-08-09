import SideNav from "../components/shared/SideNav";
import TopNavigation from "../components/shared/TopNavigation";
import { ReactNode, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function MainLayout({ children }: { children: ReactNode }) {
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(isSmallScreen);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopNavigation
        isSmallScreen={isSmallScreen}
        toggleDrawer={toggleDrawer}
      />
      <SideNav
        isSmallScreen={isSmallScreen}
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
