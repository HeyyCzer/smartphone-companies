import { faBuilding, faHome, faSuitcase } from "@fortawesome/free-solid-svg-icons";
import NavbarButton from "./Button";

export default function Navbar() {
	return (
		<nav className="fixed bottom-[-0.5px] bg-dark-3 h-12 w-full">
			<div className="grid grid-cols-3 py-1">
				<NavbarButton icon={faHome} name="Início" to="/" />
				<NavbarButton icon={faSuitcase} name="Vagas" to="/jobs" />
				<NavbarButton icon={faBuilding} name="Minha empresa" to="/my-company" />
			</div>
		</nav>
	);
}
