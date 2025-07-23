import {useState} from "react";
import {Show} from "@/lib/types";
import {fetchShows} from "@/lib/api";

export const useShows = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShowsByQuery = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchShows(encodeURIComponent(query));
            setShows(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return { shows, loading, error, fetchShowsByQuery };
};
