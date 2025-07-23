import {Show} from "@/lib/types";
import React from "react";

interface Props {
    show: Show;
    onClick: (showId: number) => void;
}

export default function ShowCard( { show, onClick }: Props) {
    return (
        <div
            className="border p-4 rounded cursor-pointer hover:bg-blue-100"
            onClick={() => onClick(show.id)}
        >
            <h2 className="text-lg font-semibold">{show.name}</h2>
            <p className="text-sm text-gray-500">{show.genres.join(', ')}</p>
            {show.summary && (
                <div
                    className="prose mt-2"
                    dangerouslySetInnerHTML={{ __html: `${show.summary.substring(0, 100)}...` }}
                />
            )}
        </div>
    );
}