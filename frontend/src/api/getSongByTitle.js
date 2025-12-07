import { API_URL } from "../constants/apiUrl";

export async function getSongByTitle(title) {
    const res = await fetch(
        `${API_URL}/title?title=${encodeURIComponent(title)}`
    );
    return res;
}