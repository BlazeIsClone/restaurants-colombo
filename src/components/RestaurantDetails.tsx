"use client";

import { Restaurant } from "@/types/restaurant";
import { ImageGallery } from "./ImageGallery";
import { OpeningHours } from "./OpeningHours";
import { PerfectFor } from "./PerfectFor";
import { Deal } from "./Deal";

const TYPE_LABELS: Record<string, string> = {
  cafe: "Cafe",
  bakery: "Bakery",
  fine_dining: "Fine Dining",
  casual_dining: "Casual Dining",
  bar: "Bar",
};

const TYPE_COLORS: Record<string, string> = {
  cafe: "bg-amber-100 text-amber-700",
  bakery: "bg-orange-100 text-orange-700",
  fine_dining: "bg-purple-100 text-purple-700",
  casual_dining: "bg-green-100 text-green-700",
  bar: "bg-rose-100 text-rose-700",
};

interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onNameClick?: () => void;
}

export const RestaurantDetails = ({
  restaurant,
  onNameClick,
}: RestaurantDetailsProps) => {
  return (
    <article>
      <ImageGallery
        main_image={restaurant.main_image}
        gallery={restaurant.gallery}
        rating={restaurant.rating}
      />
      <div className="my-3">
        <h2
          className="text-2xl font-bold text-gray-900 mb-1.5 cursor-pointer hover:text-gray-600 transition-colors duration-200"
          onClick={onNameClick}
        >
          {restaurant.name}
        </h2>
        <span
          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
            TYPE_COLORS[restaurant.type] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {TYPE_LABELS[restaurant.type] ?? restaurant.type}
        </span>
      </div>
      <OpeningHours opening_hours={restaurant.opening_hours} />
      <div className="my-2 flex items-start space-x-2 text-sm text-gray-600">
        <svg
          className="w-4 h-4 text-gray-500 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <div>
          <span className="font-medium">Where:</span>
          <span className="ml-2">{restaurant.address}</span>
        </div>
      </div>
      <PerfectFor perfect_for={restaurant.perfect_for} />
      <Deal deal={restaurant.deal} />
      <div className="space-y-2">
        <p className="text-gray-700 leading-relaxed">
          {restaurant.description}
        </p>
      </div>
      <div className="pt-4">
        <a
          href={restaurant.reservation_link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
        >
          Make a Reservation
        </a>
      </div>
    </article>
  );
};
