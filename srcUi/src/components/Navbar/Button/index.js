import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function NavbarButton({ icon, name, to }) {
	const path = window.location.href.split("#")[1];
	const selected = (path === to) || (path === "" && to === "/");
	return (
		<Link to={to}>
			<div className={`pt-1 pb-2 text-center transition-colors ${selected ? "text-white" : "text-gray-400"}`}>
				<FontAwesomeIcon fontSize={14} icon={icon} />
				<p className="text-xs">{name}</p>
			</div>
		</Link>
	)
}
