import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/main/MainLayout';
import { TagsPage } from '../pages/tags-page/TagsPage';
import TodayPage from '../pages/today-page/TodayPage';
import { UpcomingPage } from '../pages/upcoming-page/UpcomingPage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<TodayPage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/upcoming" element={<UpcomingPage />} />
        <Route path="/tags" element={<TagsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);