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

const root = createRoot(document.getElementById("app"));
const devMode = !window.invokeNative;

function App() {
	moment().locale("pt-br");
	
	const { getSettings, onSettingsChange } = window;

	useEffect(() => {
		if (!devMode) {
			const updateSettings = (settings) => {
				let theme = settings.display.theme
				if (theme === "dark")
					document.documentElement.classList.add("dark");
				else
					document.documentElement.classList.remove("dark");
			}

			onSettingsChange(updateSettings);
			getSettings().then(updateSettings);
		}
	}, [onSettingsChange, getSettings]);

	return (<AppRouter />)
}

if (window.name === '' || devMode) {
    const renderApp = () => {
        root.render(
            <StrictMode>
                <App />
            </StrictMode>
        );
    };

    if (devMode) {
        renderApp();
    } else {
        window.addEventListener('message', (event) => {
            if (event.data === 'componentsLoaded') renderApp();
        });
    }
}
