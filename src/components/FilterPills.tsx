"use client";

import { RestaurantType } from "@/types/marker";

export type FilterType = RestaurantType | "all";

const TYPE_LABELS: Record<FilterType, string> = {
  all: "All",
  cafe: "Cafe",
  bakery: "Bakery",
  fine_dining: "Fine Dining",
  casual_dining: "Casual Dining",
  bar: "Bar",
};

interface FilterPillsProps {
  selected: FilterType;
  onChange: (type: FilterType) => void;
  availableTypes: RestaurantType[];
}

export const FilterPills = ({
  selected,
  onChange,
  availableTypes,
}: FilterPillsProps) => {
  const types: FilterType[] = ["all", ...availableTypes];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {types.map((type) => {
        const isActive = selected === type;
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-150 ${
              isActive
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {TYPE_LABELS[type]}
          </button>
        );
      })}
    </div>
  );
};
