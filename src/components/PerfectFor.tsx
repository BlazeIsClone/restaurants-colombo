interface PerfectForProps {
    perfect_for: string[];
}

const formatTag = (tag: string) => {
    return tag.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const getTagColor = (tag: string) => {
    const colors = {
        casual_dining: "bg-green-100 text-green-800",
        solo_dining: "bg-blue-100 text-blue-800",
        date_night: "bg-pink-100 text-pink-800",
        group_dining: "bg-purple-100 text-purple-800",
        family_dining: "bg-orange-100 text-orange-800",
        fine_dining: "bg-red-100 text-red-800",
        coffee_meeting: "bg-yellow-100 text-yellow-800",
        dessert_lovers: "bg-indigo-100 text-indigo-800",
    };

    return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const PerfectFor = ({ perfect_for }: PerfectForProps) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
                <span className="font-medium">Perfect for:</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {perfect_for.map((tag, index) => (
                    <span
                        key={index}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                        {formatTag(tag)}
                    </span>
                ))}
            </div>
        </div>
    );
};
