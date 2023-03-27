import { faBuilding, faHome, faSuitcase } from "@fortawesome/free-solid-svg-icons";
import NavbarButton from "./Button";

export default function Navbar() {
	return (
		<nav className="fixed bottom-[-0.5px] bg-dark-3 h-14 w-full">
			<div className="grid grid-cols-3 pt-1 pb-2">
				<NavbarButton icon={faHome} name="Início" to="/" />
				<NavbarButton icon={faSuitcase} name="Vagas" to="/jobs" />
				<NavbarButton icon={faBuilding} name="Minha empresa" to="/my-company" />
			</div>
		</nav>
	);
}
