import React from "react";

interface Props {
    query: string;
    loading: boolean;
    setQuery: (q: string) => void;
    onSearch: (q: string) => void;
}

export default function SearchForm({ query, loading, setQuery, onSearch }: Props){
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
            <input
                className="border p-2 rounded flex-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <button
                className={`bg-blue-500 text-white px-4 rounded hover:bg-blue-700 ${loading || !query.trim() ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                type="submit"
                disabled={loading || !query.trim()}
            >
                Search
            </button>
        </form>
    );
};
