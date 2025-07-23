import {Show} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchShows = async (
    query: string,
) => {
    if (!query) {
        throw new Error("Query param is missing");
    }
    const url = `${API_URL}/shows`;

    const headers = {
        "Content-Type": "application/json",
    };
    const payload = {
        query,
    };

    const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data = (await res.json()) as { shows: Show[] };

    return data.shows;
};

export const fetchShow = async (
    id: number,
) => {
    if (!id) {
        throw new Error("Show ID is missing");
    }

    const url = `${API_URL}/shows/${id}`;

    const headers = {
        "Content-Type": "application/json",
    };

    const res = await fetch(url, {
        method: "GET",
        headers,
    });

    if (!res.ok) {
        throw new Error("Failed to fetch show data");
    }

    const data = (await res.json()) as { show: Show };

    return data.show;
};