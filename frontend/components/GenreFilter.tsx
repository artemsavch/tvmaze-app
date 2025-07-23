'use client';

interface Props {
    genres: string[];
    selectedGenre: string | null;
    onSelect: (genre: string | null) => void;
}

export default function GenreFilter({
    genres,
    selectedGenre,
    onSelect
}: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
                <button
                    key={g}
                    onClick={() => onSelect(selectedGenre === g ? null : g)}
                    className={`px-3 py-1 rounded-full border cursor-pointer ${
                        selectedGenre === g
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    {g}
                </button>
            ))}
        </div>
    );
}
