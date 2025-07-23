"use client";

import {Show} from "@/lib/types";

interface Props {
    show: Show;
    onClose: () => void;
}

export default function ShowModal( { show, onClose }: Props) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded max-w-lg w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">{show.name}</h2>
                <p className="text-xl font-bold mb-4">Show ID - {show.id}</p>
                <p className="text-xl font-bold mb-4">Show Type - {show.type}</p>
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: show.summary }}
                />
            </div>
        </div>
    );
}