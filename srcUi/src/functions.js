import axios from "axios";
import { useEffect } from "react";

export default function FunctionsComponent() {
	useEffect(() => {
		const onKeyDown = ({ key }) => {
			if (key === 'Backspace' || key === 'Escape') {
				if (document.querySelectorAll("input:focus").length > 0 || document.querySelectorAll("textarea:focus").length > 0) return;

				axios.post("http://smartphone/keydown", { key });
			}
		}
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		}
	}, []);
}
