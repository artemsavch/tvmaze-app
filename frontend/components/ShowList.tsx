import {Show} from "@/lib/types";
import ShowCard from "@/components/ShowCard";

interface Props {
    shows: Show[];
    onCardClick: (id: number) => void;
}

export default function ShowList({ shows, onCardClick }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {shows.map((show) => (
                <ShowCard key={show.id} show={show} onClick={onCardClick} />
            ))}
        </div>
    );
}
