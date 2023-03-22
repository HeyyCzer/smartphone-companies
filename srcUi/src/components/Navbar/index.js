import { faHome, faSuitcase, faUser } from "@fortawesome/free-solid-svg-icons";
import NavbarButton from "./Button";

export default function Navbar() {
	return (
		<nav className="fixed bottom-0 bg-dark-3 w-full">
			<div className="flex justify-around">
				<NavbarButton icon={faHome} name="Início" to="/" />
				<NavbarButton icon={faSuitcase} name="Vagas" to="/vagas" />
				<NavbarButton icon={faUser} name="Seu perfil" to="/perfil" />
			</div>
		</nav>
	);
}
