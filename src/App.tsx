import Country from "./pages/country";
import Home from "./pages/home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:countryname" element={<Country />} />
      </Routes>
    </main>
  );
}

export default App;
