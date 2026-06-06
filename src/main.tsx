import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initTilt3D } from "./lib/tilt3d";

initTilt3D();

createRoot(document.getElementById("root")!).render(<App />);
