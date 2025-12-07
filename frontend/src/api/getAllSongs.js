import { API_URL } from "../constants/apiUrl";

export async function getAllSongs() {
    // Call the new dedicated endpoint that returns the full list
    const res = await fetch(`${API_URL}/all`);

    if (!res.ok) {
        throw new Error(`Failed to fetch all songs: ${res.status}`);
    }

    // Backend returns a plain array of songs here
    const allSongs = await res.json();
    return allSongs;
}
