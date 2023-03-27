import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes";

import 'animate.css';
import 'tippy.js/dist/tippy.css';

import "./styles/globals.css";
import "./styles/tippy.css";
import "./styles/modals.css";

import moment from "moment";
import 'moment/locale/pt-br';

function AppComponent() {
	moment().locale("pt-br");
	
	return (
		<StrictMode>
			<AppRouter />
		</StrictMode>
	)
}

createRoot(document.getElementById("app")).render(
	<AppComponent />
);
