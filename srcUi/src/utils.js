import axios from "axios";
import EventEmitter from "eventemitter3";
import Swal from "sweetalert2/dist/sweetalert2.js";

const eventEmitter = new EventEmitter();

export const isDevEnv = () => !window.invokeNative && process.env.NODE_ENV === "development";

const getResourceName = () => {
	return "smartphone-companies";
};

export function processRequest(action, data) {
	if (!action)
		return debug("Unknown action requested!");

	debug("Dispatched event:", color(action, "blue"), JSON.stringify(data));
	eventEmitter.emit(action, data);
}

const axiosInstance = axios.create({
	baseURL: `https://${getResourceName()}/`,
	timeout: 5000,
});

axiosInstance.interceptors.request.use(
	(request) => {
		debug("Making request:", color(request.url, "blue"), JSON.stringify(request.data || {}));

		if (isDevEnv()) {
			return {
				cancelToken: new axios.CancelToken((cancel) => cancel("Ambiente de desenvolvimento detectado. Request cancelado.")),
			};
		}

		return request;
	},
	(err) => {
		error(`${err.message}:`, color(err.config.url, "red"), err.config.data);
		return Promise.reject(err)
	},
);

axiosInstance.interceptors.response.use(
	(response) => {
		debug("Request response:", color(response.config.url, "blue"), JSON.stringify(response.data));
		return response;
	},
	(err) => {
		error(`${err.message}:`, color(err.config?.url, "red"), err.config?.data);
		return Promise.reject(err);
	},
);

export { eventEmitter, axiosInstance };

export const Modal = Swal.mixin({
	confirmButtonText: `<i class="fa-solid fa-check mr-1"></i> Confirmar`,
	cancelButtonText: `<i class="fa-solid fa-xmark mr-1"></i> Cancelar`,
});
	
let debugEnabled = false;

export const debug = (...message) => {
	if (isDevEnv() || debugEnabled) console.info(color("[DEBUG]", "blue"), ...message);
};

export const warn = (...message) => {
	console.warn(color("[WARNING]", "yellow"), ...message);
};

export const error = (...message) => {
	console.error(color("[ERROR]", "red"), ...message);
};

const colors = {
	reset: "^0",
	red: "^1",
	green: "^2",
	yellow: "^3",
	blue: "^4",
};

export const color = (text, color) => {
	if (isDevEnv()) return text;
	if (!colors[color]) {
		error("Color missing: " + color);
		return text;
	}

	return colors[color] + text + colors.reset;
};
