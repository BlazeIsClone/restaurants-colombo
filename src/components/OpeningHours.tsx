interface OpeningHoursProps {
    opening_hours: {
        days: string[];
        hours: string;
    };
}

export const OpeningHours = ({ opening_hours }: OpeningHoursProps) => {
    const formatDays = (days: string[]) => {
        if (days.length === 7) {
            return "Daily";
        }
        return days.join(", ");
    };

    return (
        <div className="my-3 flex items-center space-x-2 text-sm text-gray-600">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span className="font-medium">When:</span>
            <span>{formatDays(opening_hours.days)} {opening_hours.hours}</span>
        </div>
    );
};
