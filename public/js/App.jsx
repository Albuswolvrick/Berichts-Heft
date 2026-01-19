import React from "react";
import { Routes, Route } from "react-router-dom";
import VerticalNavBar from "./VerticalNavBar";

const navItems = [
  { label: "Home", path: "/" },
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
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/Tagesbericht" element={<h1>Tagesbericht</h1>} />
          <Route path="/Wochenbericht" element={<h1>Wochenbericht</h1>} />
          <Route path="/Jahresbericht" element={<h1>Jahres bericht</h1>} />
          <Route path="/dev" element={<h1>dev</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
