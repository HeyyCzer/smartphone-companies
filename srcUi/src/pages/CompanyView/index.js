import { faBell, faCaretUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import App from "../../components/_app";
import LoadingPage from "../_Loading";

import TextareaAutosize from 'react-textarea-autosize';

import AnnounceMessage from "../../components/AnnounceMessage";
import { axiosInstance, eventEmitter, isDevEnv } from "../../utils";

export default function CompanyViewPage() {
	const { companyId } = useParams();

	const { register, handleSubmit, reset } = useForm();

	const [loading, setLoading] = useState(!isDevEnv());
	const [company, setCompany] = useState(isDevEnv() ? {
		name: "The Emerald Bar",
		type: "Restaurante",
		avatar: "https://wallpaperaccess.com/full/5749057.jpg",
		isOpen: true,
		
		canEdit: true,
	} : {});
	const [announces, setAnnounces] = useState(isDevEnv() ? [
		{
			id: 10,
			author: "HeyyCzer",
			message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euismod enim quis orci aliquam iaculis. Donec volutpat consectetur massa vel condimentum.\n\nInteger vitae pretium eros.",
			image: "https://www.igta5.com/images/official-screenshot-cant-touch-this.jpg",
			createdAt: new Date().getTime(),
		}
	] : isDevEnv());

	const [creatingAnnounce, setCreatingAnnounce] = useState(false);
	useEffect(() => {
		const refreshCompany = () => {
			setLoading(!isDevEnv());
			axiosInstance.post("/getCompany", { id: companyId })
				.then(({ data }) => {
					setCompany(data.company);
					setAnnounces(data.announces);
					setLoading(false);
				});
		}
		refreshCompany();
		eventEmitter.on("refreshCompany", refreshCompany);

		return () => eventEmitter.off("refreshCompany");
	}, [companyId]);

	const createAnnounce = ({ message, image }) => {
		axiosInstance.post("/createAnnounce", { companyId, message, image })
			.then(() => {
				reset();
				setCreatingAnnounce(false);
				eventEmitter.emit("refreshCompany");
			});
	}

	const toggleStatus = () => {
		axiosInstance.post("/toggleStatus", { id: companyId })
			.then(() => {
				eventEmitter.emit("refreshCompany");
			});
	}

	if (loading)
		return <LoadingPage />

	return (
		<App>
			{/* Title */}
			<div className="py-4 text-center">
				<h5 className="text-2xs text-white/40 -mb-0.5">{ company.type }</h5>
				<h1 className="text-xs text-white/70">{ company.name }</h1>
			</div>

			<div className="pt-5">
				{/* Presentation */}
				<section className="text-center">
					<div className="mx-auto h-32 w-32 rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${company.avatar})` }} />
					<h1 className="mt-2 text-center text-white font-semibold">{company.name}</h1>
					
					{
						company.canEdit ?
							<button
								type="button"
								className={`text-white ${company.isOpen ? "bg-red-600" : "bg-primary"} py-1 px-2 rounded-lg text-xs`}
								onClick={toggleStatus}
							>
								{!company.isOpen ? "Abrir" : "Fechar"}
							</button>
							:
						<span className={`text-xs ${company.isOpen ? "text-primary" : "text-gray-500"}`}>{ company.isOpen ? "Aberto" : "Fechado" }</span>
					}
				</section>
				
				{/* Announces */}
				<section className="animate__animated animate__backInLeft bg-dark-3 my-4 mx-auto w-4/5 px-3.5 pt-2 pb-4 rounded-lg">
					{/* Title */}
					<h3 className="text-2xs text-center text-white/40 font-light">
						<FontAwesomeIcon icon={faBell} className="mr-1.5" />
						Anúncios
					</h3>

					{ company.canEdit &&
						<div className="flex justify-end">
							<button className="text-primary text-xs" type="button" onClick={() => setCreatingAnnounce(!creatingAnnounce)}>
								<FontAwesomeIcon icon={!creatingAnnounce ? faPlus : faCaretUp} />
							</button>
						</div>
					}

					{/* List */}
					<div>
						{creatingAnnounce &&
							<form className="flex flex-col my-2 text-2xs text-gray-300" onSubmit={handleSubmit(createAnnounce)}>
								<TextareaAutosize
									placeholder="Escreva o anúncio aqui"
									minRows={3}
									autoFocus
									className="px-2 py-2 bg-dark-1 focus:outline-none resize-none w-full rounded-lg"
									{...register("message", { required: true })}
								/>

								<input
									placeholder="URL da imagem (opcional)"
									className="px-2 py-2 bg-dark-1 focus:outline-none rounded-lg mt-1"
									{...register("image")}
								/>
							
								<button className="bg-primary text-white rounded-lg py-1 mt-1">Criar</button>
							</form>
						}

						{
							!creatingAnnounce && announces.length === 0 ?
								<div className="text-center text-xs text-white">Nenhum anúncio</div> :
								
								announces.map((announce, index) => (
									<AnnounceMessage
										key={index}
										id={announce.id}
										author={announce.author}
										createdAt={announce.createdAt}
										message={announce.message}
										image={announce.image}
										canDelete={company.canEdit}
									/>
								))
						}
					</div>
				</section>
			</div>
		</App>
	);
}
