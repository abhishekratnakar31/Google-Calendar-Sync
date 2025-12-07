import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import Events from "./pages/Events";
import GoogleSync from "./pages/GoogleSync";
import Login from "./pages/Login";
import Curve from "./components/Curve";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Curve><Home /></Curve>} />
        <Route path="/events" element={<Curve><Events /></Curve>} />
        <Route path="/gcal" element={<Curve><GoogleSync /></Curve>} />
        <Route path="/login" element={<Curve><Login /></Curve>} />
      </Routes>
    </AnimatePresence>
  );
}

import ThemeCurve from "./components/ThemeCurve";

function App() {
  return (
    <ThemeProvider>
      <ThemeCurve />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
