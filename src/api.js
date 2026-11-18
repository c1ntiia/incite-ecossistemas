import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://observatoriocti.secti.ba.gov.br/incite/ecossistemas/api/",
});