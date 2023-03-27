import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import moment from "moment";
import { axiosInstance, eventEmitter, Modal } from "../../utils";

export default function AnnounceMessage({ id, author, createdAt, message, image, canDelete }) {
	const date = moment(new Date(createdAt));

	const deleteAnnounce = () => {
		Modal.fire({
			html: `Deseja realmente <span class="text-primary">excluir</span> este anúncio?`,
			footer: `<span class="text-xs">Esta ação não poderá ser revertida</span>`,

			confirmButtonText: "Excluir",
			showCancelButton: true,
		}).then(({ isConfirmed }) => {
			if (!isConfirmed) return;

			axiosInstance.post("/deleteAnnounce", { id })
				.then(() => {
					eventEmitter.emit("refreshCompany");
				})
		});
	}

	return (
		<div className="py-3 text-xs">
			{/* Author & Time */}
			<div className="flex">
				<span className="text-white mr-1.5">
					{ author }
					<Tippy content="Funcionário" className="text-2xs" offset={[0, 5]}>
						<FontAwesomeIcon icon={faCheck} className="ml-1 text-2xs text-primary" />
					</Tippy>
				</span>

				<Tippy content={date.calendar()} className="text-2xs" offset={[0, 5]}>
					<span className="text-white/40 text-2xs font-light">{date.fromNow()}</span>
				</Tippy>

				{
					canDelete &&
						<button type="button" onClick={deleteAnnounce} className="ml-auto mr-0 text-2xs text-red-600">
							<FontAwesomeIcon icon={faTrash} />
						</button>
				}
			</div>

			{/* Message */}
			<div className="text-white/90 font-light text-xs text-justify whitespace-pre-wrap">
				{ message }
			</div>

			{image &&
				<img src={image} className="animate__animated animate__fadeIn animate__delay-1s mt-2" alt="Announce message" />
			}
		</div>
	)
}