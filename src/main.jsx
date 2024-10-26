import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import NavBar from "./Components/NavBar.jsx";
import "./index.css";
import Footer from "./Components/Footer.jsx";
import NavigationContext from "./context/NavigationContext.js";
import NavigationContextProvider from "./context/NavigationContextProvider.jsx";

// const [artifactsClicked, setArtifactsClicked] = useState(false)
// const [membersClicked, setMembersClicked] = useState(false)
// const [aboutUsClicked, setAboutUsClicked] = useState(false)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <NavigationContextProvider>
        <NavBar />
        <App />
        <Footer />
      </NavigationContextProvider>
    </BrowserRouter>
  </StrictMode>
);
