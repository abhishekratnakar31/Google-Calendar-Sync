import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import Events from "./pages/Events";
import GoogleSync from "./pages/GoogleSync";


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gcal" element={<GoogleSync />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
