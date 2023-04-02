import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes";

import 'animate.css';
import 'tippy.js/dist/tippy.css';

import "./styles/globals.css";
import "./styles/modals.css";
import "./styles/tippy.css";

import moment from "moment";
import 'moment/locale/pt-br';

function AppComponent() {
	moment().locale("pt-br");
	
	useEffect(() => {
		const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
		/* dark - boolean
		fontSize - int px
		android - boolean */

		if (params.dark === "true")
			document.documentElement.classList.add("dark");
		else
			document.documentElement.classList.remove("dark");
	}, []);

	return (
		<StrictMode>
			<AppRouter />
		</StrictMode>
	)
}

createRoot(document.getElementById("app")).render(
	<AppComponent />
);
