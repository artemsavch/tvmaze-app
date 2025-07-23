'use client';

import React, {useMemo, useState} from 'react';
import {fetchShow, fetchShows} from "@/lib/api";
import { Show } from "@/lib/types";
import ShowCard from "@/components/ShowCard";
import GenreFilter from "@/components/GenreFilter";
import ShowModal from "@/components/ShowModal";

export default function Search() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [shows, setShows] = useState<Show[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        setLoading(true);
        setError(null);
        setShows([]);

        try {
            const shows = await fetchShows(encodeURIComponent(trimmedQuery));
            setShows(shows);
        } catch (err) {
            if (err instanceof Error) setError(err.message)
            else  setError('Something went wrong...');
        } finally {
            setLoading(false);
        }
    }

    const genres = useMemo(() => (
            Array.from(
                new Set(shows.flatMap((show) => show.genres || []))
            )
        ), [shows]
    );

    const filteredResults = useMemo(() => (
        selectedGenre
            ? shows.filter((show) => show.genres.includes(selectedGenre))
            : shows
    ), [shows, selectedGenre]);

    const handleCardClick = async (showId: number) => {
        setLoading(true);
        try {
            const show = await fetchShow(showId);
            setSelectedShow(show);
            setShowModal(true);
        } catch (err) {
            if (err instanceof Error) setError(err.message)
            else  setError('Something went wrong...');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
                <input
                    className="border p-2 rounded flex-1"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    onFocus={() => setError("")}
                />
                <button
                    className={`bg-blue-500 text-white px-4 rounded cursor-pointer hover:bg-blue-700 ${loading || query.length === 0 ? "opacity-50 cursor-default pointer-events-none" : ""}`}
                    type="submit"
                    disabled={loading || query.length === 0}
                >
                    Search
                </button>
            </form>

            {genres.length > 0 && (
                <GenreFilter
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onSelect={setSelectedGenre}
                />
            )}

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {filteredResults.map((item) => (
                        <ShowCard show={item} key={item.id} onClick={handleCardClick}/>
                    ))}
                </div>
            ) : "Shows not found..."}

            {showModal && selectedShow && (
                <ShowModal
                    show={selectedShow}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
