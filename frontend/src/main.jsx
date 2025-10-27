import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import StoreContextProvider from "./components/context/StoreContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </BrowserRouter>
);
