import { RestaurantType } from "@/types/marker";

interface MarkerLegendProps {
    className?: string;
}

const markerTypes: { type: RestaurantType; label: string; emoji: string }[] = [
    { type: 'cafe', label: 'Cafe', emoji: '☕' },
    { type: 'bakery', label: 'Bakery', emoji: '🍰' },
    { type: 'fine_dining', label: 'Fine Dining', emoji: '🍴' },
    { type: 'casual_dining', label: 'Casual Dining', emoji: '🍽️' },
    { type: 'bar', label: 'Bar', emoji: '🍺' }
];

export const MarkerLegend = ({ className = "" }: MarkerLegendProps) => {
    return (
        <div className={`bg-white p-4 rounded-lg shadow-md border ${className}`}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Restaurant Types</h3>
            <div className="space-y-2">
                {markerTypes.map(({ type, label, emoji }) => (
                    <div key={type} className="flex items-center space-x-2">
                        <span className="text-lg">{emoji}</span>
                        <span className="text-xs text-gray-600">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
