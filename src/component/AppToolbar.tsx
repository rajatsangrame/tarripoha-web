import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpen from '@mui/icons-material/MenuOpen';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CorporateFare from '@mui/icons-material/CorporateFare';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import ToolbarAccount from './ToolbarAccount';
import { useThemeContext } from '../context/ThemeContext';

interface AppToolbarProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

const AppToolbar: React.FC<AppToolbarProps> = ({ drawerOpen, toggleDrawer }) => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ mr: 2 }}>
          {drawerOpen ? <MenuOpen /> : <MenuIcon />}
        </IconButton>

        <IconButton edge="start" color="inherit" aria-label="logo" sx={{ ml: 1, mr: 2 }}>
          <CorporateFare />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Tarripoha
        </Typography>

        <IconButton color="inherit" onClick={toggleTheme}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <ToolbarAccount />
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;