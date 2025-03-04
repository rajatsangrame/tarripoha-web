import React from 'react';

import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import DrawerHeader from './DrawerHeader';

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/home' },
  { text: 'Search', icon: <SearchIcon />, path: '/search' },
  { text: 'Saved', icon: <BookmarksIcon />, path: '/saved' },
];

interface NavigationDrawerProps {
  drawerOpen: boolean;
  drawerWidthExpanded: number;
  drawerWidthCollapsed: number;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ drawerOpen, drawerWidthCollapsed, drawerWidthExpanded }) => {
  const location = useLocation();

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Drawer variant="permanent" anchor="left"
        sx={{
          width: drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed,
            transition: 'width 0.3s ease',
          },
        }}>
        <DrawerHeader />
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
};

export default NavigationDrawer;
