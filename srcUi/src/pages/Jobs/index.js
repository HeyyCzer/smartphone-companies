import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Job from "../../components/Job";
import App from "../../components/_app";
import { axiosInstance, isDevEnv } from "../../utils";
import LoadingPage from "../_Loading";

export default function JobsPage() {
	const [loading, setLoading] = useState(!isDevEnv());
	const [jobs, setJobs] = useState([
		{
			id: 1,
			author: "Jotta",
			phone: "123-456",
			description: "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back.\n\nIf he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.", // 200 char collapsed
			canDelete: false,
			createdAt: moment().subtract(1, "hour").toDate().getTime(),
		},
		{
			id: 2,
			author: "HeyyCzer",
			phone: "654-321",
			description: "Just a simple job!", // 200 char collapsed
			canDelete: true,
			createdAt: moment().subtract(1, "days").toDate().getTime(),
		},
	]);

	useEffect(() => {
		axiosInstance.post("/getJobs")
			.then(({ data }) => {
				setLoading(false);
				setJobs(data);
			});
	}, []);

	if (loading)
		return <LoadingPage />

	return (
		<App>
			{/* Title */}
			<h1 className="text-xs text-white/70 py-4 text-center">Vagas de Emprego</h1>

			{/* Jobs */}
			<div className="mx-3">
				{
					jobs.map((job, index) => (
						<Job
							key={index} id={job.id}
							author={job.author}
							phone={job.phone}
							description={job.description}
							createdAt={job.createdAt}
							canDelete={job.canDelete}
						/>
					))
				}
			</div>

			{/* Create new job */}
			<Link to="/jobs/create" className="absolute bottom-16 right-4 py-[0.20rem] px-2 bg-primary text-white rounded-full text-center">
				<FontAwesomeIcon icon={faPlus} />
			</Link>
		</App>
	)
}
