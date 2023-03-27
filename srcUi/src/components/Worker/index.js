import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";

export default function Worker({ id, name, status }) {
	if (status === "online")
		status = ["Na cidade", "text-amber-500"];
	else if (status === "working")
		status = ["Trabalhando", "text-green-500"];
	else
		status = ["Dormindo", "text-gray-500"];

	return (
		<div className="py-0.5">
			<div className="text-white/80 text-xs">
				<span className="flex">
					<Tippy content={status[0]} className="text-xs" offset={[0, 5]}>
						<FontAwesomeIcon className={`my-auto mr-2 ${status[1]}`} icon={faCircle} fontSize={4} />
					</Tippy>
					<span className="mr-2 text-gray-500">#{id}</span> {name}
				</span>
			</div>
		</div>
	)
}
