import { faClock, faVest } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import BankAction from "../../components/BankAction";
import Worker from "../../components/Worker";
import App from "../../components/_app";
import { axiosInstance, eventEmitter, isDevEnv, Modal } from "../../utils";
import LoadingPage from "../_Loading";

export default function MyCompany() {
	const [loading, setLoading] = useState(!isDevEnv());
	const [unauthorized, setUnauthorized] = useState(false);

	const formatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
	const [company, setCompany] = useState({
		balance: 0,
		workers: [],
		bankLogs: [],
	});

	useEffect(() => {
		const refreshMyCompany = () => {
			axiosInstance.post("/getMyCompany")
				.then(({ data }) => {
					setLoading(false);
					if (data.unauthorized)
						return setUnauthorized(true);
					
					setCompany(data);
				});
		}
		refreshMyCompany();

		eventEmitter.on("refreshMyCompany", refreshMyCompany);
		return () => eventEmitter.off("refreshMyCompany");
	}, []);

	if (loading)
		return <LoadingPage />
	
	if (unauthorized)
		return (
			<App>
				<div className="flex flex-col justify-center items-center h-full w-2/3 mx-auto text-center">
					<span className="text-2xl">😒</span>
					<h1 className="text-white/70 text-sm">Você não possui acesso à essa página!</h1>
				</div>
			</App>
		)

	const doWithdraw = () => {
		Modal.fire({
			html: `Quanto você deseja <span class="text-primary">sacar</span> para sua conta bancária?`,
			input: "number",
			inputAttributes: {
				min: 1
			},

			confirmButtonText: "Sacar",
			showCancelButton: true,
		}).then(({ isConfirmed, value }) => {
			if (!isConfirmed) return;

			axiosInstance.post("/withdrawMoney", { value })
				.then(() => {
					eventEmitter.emit("refreshMyCompany");
				})
		});
	}

	const doDeposit = () => {
		Modal.fire({
			html: `Quanto você deseja <span class="text-primary">depositar</span> na conta da empresa?`,
			input: "number",
			inputAttributes: {
				min: 1
			},

			confirmButtonText: "Depositar",
			showCancelButton: true,
		}).then(({ isConfirmed, value }) => {
			if (!isConfirmed) return;

			axiosInstance.post("/depositMoney", { value })
				.then(() => {
					eventEmitter.emit("refreshMyCompany");
				})
		});
	}
	
	return (
		<App>
			{/* Title */}
			<h1 className="text-xs text-white/70 py-4 text-center">Gerenciar empresa</h1>

			<div className="mx-3">
				{/* Bank */}
				<section>
					<div className="px-5 pt-3 pb-4 bg-dark-3 rounded-lg w-full">
						<span className="text-xs text-white/50 tracking-wide">Saldo disponível</span>
						<h1 className="text-2xl leading-none text-white tracking-wider">$ { formatter.format(company.balance) }</h1>
					</div>

					<div className="my-2 text-xs flex justify-between text-white">
						<button className="bg-gray-500 rounded-lg py-1 px-2 w-1/3" onClick={doWithdraw}>Sacar</button>
						<button className="bg-primary rounded-lg py-1 px-2 w-1/3" onClick={doDeposit}>Depositar</button>
					</div>

					{/* Online */}
					<div className="my-4 bg-dark-3 rounded-lg px-5 py-3">
						{/* Title */}
						<h3 className="text-2xs text-center text-white/40 font-light">
							<FontAwesomeIcon icon={faVest} className="mr-1.5" />
							Funcionários
						</h3>

						<div className="my-2">
							{
								company.workers.length === 0 ?
									<div className="text-center text-xs text-white">Nenhum funcionário</div> :

									company.workers.map((worker) => (
										<Worker
											id={worker.id}
											name={worker.name}
											status={worker.status}
										/>
									))
							}
						</div>
					</div>					

					{/* Logs */}
					<div className="my-4 bg-dark-3 rounded-lg px-5 py-3">
						{/* Title */}
						<h3 className="text-2xs text-center text-white/40 font-light">
							<FontAwesomeIcon icon={faClock} className="mr-1.5" />
							Histórico
						</h3>

						<div className="my-2">
							{
								company.bankLogs.length === 0 ? <div className="text-center text-xs text-white">Nenhum histórico até o momento</div> :

								company.bankLogs.map((bankLog) => (
									<BankAction
										author={bankLog.author}
										action={bankLog.action}
										amount={bankLog.amount}
										date={bankLog.date}
									/>
								))
							}
						</div>
					</div>
				</section>
			</div>
		</App>
	)
}
