interface DealsProps {
    deals: string[];
}

const formatDeal = (deal: string) => {
    return deal.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const Deals = ({ deals }: DealsProps) => {
    if (deals.length === 0) return null;

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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                </svg>
                <span className="font-medium">The Deal:</span>
            </div>
            <div className="space-y-1">
                {deals.map((deal, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2"
                    >
                        <svg
                            className="w-4 h-4 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                        </svg>
                        <span className="text-sm font-medium text-yellow-800">
                            {formatDeal(deal)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
