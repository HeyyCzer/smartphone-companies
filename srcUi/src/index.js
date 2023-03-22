import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes";
import "./styles/globals.css";

function AppComponent() {
	return (
		<StrictMode>
			<AppRouter />
		</StrictMode>
	)
}

createRoot(document.getElementById("app")).render(
	<AppComponent />
);
