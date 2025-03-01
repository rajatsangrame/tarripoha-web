import { Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import DrawerHeader from './DrawerHeader';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Login from '../pages/Login';
import Saved from '../pages/Saved';

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
      </Routes>

    </Container>
  );
};

export default MainContainer;
