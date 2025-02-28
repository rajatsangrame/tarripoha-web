import React from "react";
import { Box } from "@mui/material";
import NavigationDrawer from "./component/NavigationDrawer";
import AppToolbar from "./component/AppToolbar";
import MainContainer from "./component/MainContainer";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import GlobalDialog from "./component/GlobalDialog";
import GlobalSnackbar from "./component/GlobalSnackbar";
import { ThemeContextProvider } from "./context/ThemeContext";

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const drawerWidthCollapsed = 70;
  const drawerWidthExpanded = 240;

  return (
    <ThemeContextProvider>
      <AuthProvider>
        <Box display="flex" flexDirection="column" height="100vh">
          <AppToolbar
            drawerOpen={drawerOpen}
            toggleDrawer={toggleDrawer} />
          <Box display="flex" flexDirection="row" width="100%" overflow="visible"
            sx={{ flexShrink: 0 }}>
            <NavigationDrawer
              drawerOpen={drawerOpen}
              drawerWidthCollapsed={drawerWidthCollapsed}
              drawerWidthExpanded={drawerWidthExpanded}
            />
            <MainContainer />
          </Box>
          <GlobalSnackbar />
          <GlobalDialog />
        </Box>
      </AuthProvider>
    </ThemeContextProvider>
  );
};

export default App;
