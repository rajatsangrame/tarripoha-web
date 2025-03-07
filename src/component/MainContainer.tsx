import React from 'react';

import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Saved from '../pages/Saved';
import Search from '../pages/Search';
import WordDetails from '../pages/WordDetails';

import DrawerHeader from './DrawerHeader';

const MainContainer: React.FC = () => {

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        flexGrow: 1,
      }}
    >
      <DrawerHeader />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/word/:id" element={<WordDetails />} />
      </Routes>

    </Container>
  );
};

export default MainContainer;
