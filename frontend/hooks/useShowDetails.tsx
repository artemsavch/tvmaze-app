import {useState} from "react";
import {Show} from "@/lib/types";
import {fetchShow} from "@/lib/api";

export const useShowDetails = () => {
    const [show, setShow] = useState<Show | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShowById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchShow(id);
            setShow(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return { show, loading, error, fetchShowById, setShow };
};