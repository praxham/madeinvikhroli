import { Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage/HomePage";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
