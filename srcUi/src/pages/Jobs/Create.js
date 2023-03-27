import App from "../../components/_app";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { axiosInstance } from "../../utils";

export default function JobsCreatePage() {
	const { register, handleSubmit, watch } = useForm();

	const navigate = useNavigate();

	const createJob = ({ description, image }) => {
		axiosInstance.post("/createJob", { description, image })
			.then(() => {
				navigate("/jobs");
			})
	}

	return (
		<App>
			{/* Title */}
			<h1 className="text-xs text-white/70 py-4 text-center">Anunciar vaga</h1>

			<form className="flex flex-col mx-3 my-2 text-2xs text-gray-300" onSubmit={handleSubmit(createJob)}>
				<div className="relative">
					<TextareaAutosize
						placeholder="Quem você está contratando? Do que você precisa? Dê uma descrição detalhada!"
						minRows={6}
						maxLength={1000}
						className="px-2 pt-2 pb-6 bg-dark-1 focus:outline-none resize-none w-full rounded-lg"
						{...register("description", { required: true })}
					/>
					<p className="absolute bottom-2 right-2 text-gray-500">{ 1000 - (watch("description")?.length || 0) }</p>
				</div>

				<input
					placeholder="URL da imagem (opcional)"
					className="px-2 py-2 bg-dark-1 focus:outline-none rounded-lg mt-1"
					{...register("image")}
				/>
			
				<button className="bg-primary text-white rounded-lg py-1 mt-4">Criar</button>
			</form>
		</App>
	)
}
