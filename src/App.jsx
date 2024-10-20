import { Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Legal from "./pages/LegalPage/Legal";
import PurchasePolicy from "./pages/PurchasePolicyPage/PurchasePolicy";



function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/legal" element={<Legal />} /> */}
        <Route path="/purchase-policy" element={<PurchasePolicy />} />

      </Routes>
    </>
  );
}

export default App;
