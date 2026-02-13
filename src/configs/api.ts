import axios from "axios";
import { env } from "./env";

export default axios.create({
  baseURL: env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: env.API_TOKEN,
  },
});
