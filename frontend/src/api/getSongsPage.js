import { API_URL } from "../constants/apiUrl";

// Get a single page of songs
export async function getSongsPage(pageNumber, size = 10) {
    const params = new URLSearchParams({
        page: String(pageNumber),
        size: String(size),
    });

    const res = await fetch(`${API_URL}?${params.toString()}`);
    return await res.json();
}