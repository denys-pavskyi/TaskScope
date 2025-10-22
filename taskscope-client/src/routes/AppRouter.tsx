import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/main/MainLayout';
import HomePage from '../pages/home-page/HomePage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);