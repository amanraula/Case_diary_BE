import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

export const fetchFromTMDB = async (url) => {
	const options = {
		headers: {
			accept: "application/json",
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NzE3MmNhMDc1NWM2Y2JiMzI2ZTI3YjJjODY1NjhlZCIsIm5iZiI6MTc0MTc2NzAwMy43MDUsInN1YiI6IjY3ZDE0MTViNDM0Yzk4YzhlYzgxNjIzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IRY4cBBPMzfiq83MQVJwAmGQ9nOuN12LCSTkAd7yvyM',
		},
	};

	const response = await axios.get(url, options);

	if (response.status !== 200) {
		throw new Error("Failed to fetch data from TMDB " + response.statusText);
	}

	return response.data;
};
