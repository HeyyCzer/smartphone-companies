import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

export default function NavbarButton({ icon, name, to }) {
	const path = useLocation().pathname;
	const selected = (path.includes(to) && to !== "/") || (path === "/" && to === "/");
	return (
		<Link to={to}>
			<div className={`text-center transition-colors ${selected ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
				<FontAwesomeIcon className="text-xs" icon={icon} />
				<p className="text-xs">{name}</p>
			</div>
		</Link>
	)
}
