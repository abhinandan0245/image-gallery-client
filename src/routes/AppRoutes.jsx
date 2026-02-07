import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import LikedImages from "../pages/LikedImages";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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
