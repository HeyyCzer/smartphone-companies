import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../utils";

export default function Company({ id, name, type, avatar, isOpen }) {
	const checkClick = (e) => {
		if (e.target.tagName === "button") e.preventDefault();
	};

	const markLocation = (e) => {
		e.preventDefault();
		axiosInstance.post("/markLocation", { id });
	};

	const getFontSize = (contentLength) => {
		let result = 14 / (contentLength / 20);
		if (result > 14)
			result = 14;
		return result;
	}

	return (
		<Link to={`/company/${id}`} className="animate__animated animate__slideInLeft bg-gray-100 dark:bg-dark-3 rounded-lg flex my-2" onClick={checkClick}>
			<div>
				<div className="h-20 w-20 rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${avatar})` }} />
			</div>
			<div className="my-2 mx-3 flex flex-col w-full">
				<span style={{ fontSize: getFontSize(name.length) }}className="text-black/80 dark:text-white/80 font-semibold tracking-[1px] leading-none mb-1">
					{name}
				</span>
				{/* <span className="text-[14px] text-black/80 dark:text-white/80 font-semibold tracking-[1px]">{ name }</span> */}
				<span className="-mt-1 text-[10px] text-black/40 dark:text-white/30 tracking-[0.5px]">
					{type} • {isOpen ? <span className="text-primary font-semibold">Aberto</span> : "Fechado"}
				</span>

				<button type="button" className="mt-auto mb-0 bg-gray-500 dark:bg-dark-5 rounded-lg text-[10px] text-white/80 hover:bg-primary dark:hover:bg-primary hover:text-white transition-colors w-full py-0.5" onClick={markLocation}>
					<FontAwesomeIcon icon={faMapLocation} className="mr-2" />
					Marcar localização
				</button>
			</div>
		</Link>
	);
}
