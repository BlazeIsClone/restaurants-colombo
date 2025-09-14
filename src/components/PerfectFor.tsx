interface PerfectForProps {
    perfect_for: string[];
}

export const PerfectFor = ({ perfect_for }: PerfectForProps) => {
    return (
        <div className="my-3 flex gap-2 align-center">
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
                        className="text-gray-600"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};
