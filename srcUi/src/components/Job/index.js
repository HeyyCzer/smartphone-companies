import { faClock, faMessage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import moment from "moment";
import { useState } from "react";
import { axiosInstance, eventEmitter } from "../../utils";

export default function Job({ id, author, phone, description, createdAt, canDelete }) {
	const [collapsed, setCollapsed] = useState(description.length > 200);

	const getFormattedDate = () => {
		const formatted = moment(new Date(createdAt)).fromNow();
		return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	}

	const openWhatsapp = () => {
		axiosInstance.post("/openWhatsapp", { phone });
	}

	const toggleCollapsed = () => {
		if (description.length <= 200)
			return;
		setCollapsed(!collapsed);
	}

	const deleteJob = () => {
		axiosInstance.post("/deleteJob", { id })
			.then(() => {
				eventEmitter.emit("refreshJobs");
			});
	}

	return (
		<div className="animate__animated animate__slideInLeft bg-dark-3 rounded-lg flex my-2">
			<div className="my-2 mx-3 flex flex-col w-full">
				<span className="text-[0.5rem] text-gray-500">
					<Tippy content={ moment(new Date(createdAt)).calendar() } className="text-xs" offset={[0, 5]}>
						<span>
							<FontAwesomeIcon icon={faClock} className="mr-1" /> { getFormattedDate() }
						</span>
					</Tippy>
				</span>

				<span className="text-xs text-white/60 tracking-[1px] font-light mb-2"><span className="text-primary font-semibold">{ author }</span> está contratando</span>

				{/* Description */}
				<div className={`whitespace-pre-wrap font-light text-white text-xs ${ description.length > 200 && "cursor-pointer"}`} onClick={toggleCollapsed}>
					{collapsed ?
						<>{ description.substring(0, 200) }<span className="text-gray-500">... <div className="text-2xs">(clique para ler mais)</div></span></> :
						description
					}
				</div>

				{/* Send message */}
				<div className="flex mt-2 text-white/80 w-full">
					<button type="button" className="bg-dark-5 hover:bg-primary hover:text-white transition-colors rounded-lg text-[10px] text-white/80 w-full py-0.5" onClick={openWhatsapp}>
						<FontAwesomeIcon icon={faMessage} className="mr-2" />
						{ phone }
					</button>
					{canDelete &&
						<button type="button" className="ml-1 bg-red-600/50 hover:bg-red-600 hover:text-white transition-colors rounded-lg text-[10px] text-white/80 w-1/6 py-0.5" onClick={deleteJob}>
							<FontAwesomeIcon icon={faTrash} />
						</button>
					}
				</div>
			</div>
		</div>
	)
}
