import React from "react";
import { Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CameraPage from "./pages/CameraPage";
import StripPage from "./pages/StripPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/camera" element={<CameraPage />} />
      <Route path="/strip" element={<StripPage />} />
    </Routes>
  );
};

export default App;
