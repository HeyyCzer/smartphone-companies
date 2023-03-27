import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

export default function NavbarButton({ icon, name, to }) {
	const path = useLocation().pathname;
	const selected = (path.includes(to) && to !== "/") || (path === "/" && to === "/");
	return (
		<Link to={to}>
			<div className={`text-center transition-colors ${selected ? "text-white" : "text-gray-400"}`}>
				<FontAwesomeIcon fontSize={14} icon={icon} />
				<p className="text-[9px]">{name}</p>
			</div>
		</Link>
	)
}
