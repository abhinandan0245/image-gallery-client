import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import LikedImages from "../pages/LikedImages";
import ProtectedRoute from "../components/ProtectedRoute";
import ImageDetailPage from "../pages/ImageDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/image/:id" element={<ImageDetailPage />} />
      <Route path="/login" element={<Login />} />
      <Route
  path="/liked"
  element={
    <ProtectedRoute>
      <LikedImages />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
};

export default AppRoutes;
