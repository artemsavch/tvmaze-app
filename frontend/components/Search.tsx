'use client';

import React, {useMemo, useState} from 'react';
import GenreFilter from "@/components/GenreFilter";
import ShowModal from "@/components/ShowModal";
import {useShows} from "@/hooks/useShows";
import {useShowDetails} from "@/hooks/useShowDetails";
import SearchForm from "@/components/SearchForm";
import ShowList from "@/components/ShowList";

export default function Search() {
    const [query, setQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const { shows, loading, error, fetchShowsByQuery } = useShows();
    const { show, loading: showLoading, error: showError, fetchShowById, setShow } = useShowDetails();

    const genres = useMemo(() => (
            Array.from(
                new Set(shows.flatMap((show) => show.genres || []))
            )
        ), [shows]
    );

    const filteredShows = useMemo(() => (
        selectedGenre ? shows.filter(show => show.genres.includes(selectedGenre)) : shows
    ), [shows, selectedGenre]);

    const handleCardClick = async (id: number) => {
        await fetchShowById(id);
        setShowModal(true);
    };

    return (
        <div>
            <SearchForm
                query={query}
                loading={loading}
                setQuery={setQuery}
                onSearch={fetchShowsByQuery}
            />

            {genres.length > 0 && (
                <GenreFilter
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onSelect={setSelectedGenre}
                />
            )}

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {filteredShows.length > 0 ? (
                <ShowList shows={filteredShows} onCardClick={handleCardClick} />
            ) : !loading && <p>No shows found.</p>}

            {showLoading && <p>Loading show details...</p>}
            {showError && <p className="text-red-500">{showError}</p>}

            {showModal && show && (
                <ShowModal
                    show={show}
                    onClose={() => {
                        setShowModal(false);
                        setShow(null);
                    }}
                />
            )}
        </div>
    );
}
