import React from "react";
import { Routes, Route } from "react-router-dom";
import VerticalNavBar from "./VerticalNavBar";
import HomePage from "./HomePage"; // Import the new HomePage component
import LoginPage from "./LoginPage"; // Import the LoginPage component
import DevMenu from "./DevMenu"; // Import the DevMenu component

const navItems = [
  { label: "Home", path: "/" },
  { label: "Login", path: "/login" },
  { label: "Tagesbericht", path: "/Tagesbericht" },
  { label: "Wochenbericht", path: "/Wochenbericht" },
  { label: "Jahresbericht", path: "/Jahresbericht" },
  { label: "devmenue", path: "/dev" }
];

function App() {
  return (
    <div style={{ display: "flex" }}>
      <VerticalNavBar items={navItems} />

      <main style={{ padding: "20px", flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} /> // Use the HomePage component
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Tagesbericht" element={<h1>Tagesbericht</h1>} />
          <Route path="/Wochenbericht" element={<h1>Wochenbericht</h1>} />
          <Route path="/Jahresbericht" element={<h1>Jahres bericht</h1>} />
          <Route path="/dev" element={<DevMenu />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
