import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FunctionsComponent() {
	const navigate = useNavigate();

	useEffect(() => {
		const previousPage = (e) => {
			if (e.key !== "Backspace") return;
	
			const onInput = (document.querySelectorAll("input:focus").length > 0 || document.querySelectorAll("textarea:focus").length > 0)
			if (onInput) return;
	
			navigate(-1);
		}
		window.addEventListener("keydown", previousPage);

		return () => {
			window.removeEventListener("keydown", previousPage);
		}
	}, [ navigate ]);
}
