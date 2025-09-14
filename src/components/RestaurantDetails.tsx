"use client";

import { Restaurant } from "@/types/restaurant";
import { ImageGallery } from "./ImageGallery";
import { OpeningHours } from "./OpeningHours";
import { PerfectFor } from "./PerfectFor";
import { Deal } from "./Deal";

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
          className="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
          onClick={onNameClick}
        >
          {restaurant.name}
        </h2>
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
