import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FunctionsComponent() {
	const navigate = useNavigate();

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
	}, [ navigate ]);
}
