import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function Company({ id, name, type, avatar, isOpen }) {
	return (
		<Link to={`/company/${id}`} className="bg-dark-2 rounded-lg flex my-2">
			<div>
				<div className="h-20 w-20 rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${avatar})` }} />
			</div>
			<div className="my-2 mx-3 flex flex-col w-full">
				<span className="text-[14px] text-white/80 font-semibold tracking-[1px]">{ name }</span>
				<span className="-mt-1 text-[10px] text-white/30 tracking-[0.5px]">
					{ type } • { isOpen ? <span className="text-primary font-semibold">Aberto</span> : "Fechado" }
				</span>

				<button type="button" className="mt-auto mb-0 bg-dark-5 rounded-lg text-[10px] text-white/80 w-full py-0.5">
					<FontAwesomeIcon icon={faMapLocation} className="mr-2" />
					Marcar localização
				</button>
			</div>
		</Link>
	)
}
