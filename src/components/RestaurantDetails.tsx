"use client";

import { Restaurant } from "@/types/restaurant";
import { ImageGallery } from "./ImageGallery";
import { OpeningHours } from "./OpeningHours";
import { PerfectFor } from "./PerfectFor";
import { Deals } from "./Deals";

interface RestaurantDetailsProps {
    restaurant: Restaurant;
    onNameClick?: () => void;
}

export const RestaurantDetails = ({ restaurant, onNameClick }: RestaurantDetailsProps) => {
    return (
        <div className="space-y-6">
            <ImageGallery
                main_image={restaurant.main_image}
                gallery={restaurant.gallery}
                rating={restaurant.rating}
            />

            <div>
                <h2
                    className="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                    onClick={onNameClick}
                >
                    {restaurant.name}
                    <svg
                        className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors duration-200"
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
                </h2>
            </div>

            <OpeningHours opening_hours={restaurant.opening_hours} />

            <div className="flex items-start space-x-2 text-sm text-gray-600">
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

            <Deals deals={restaurant.deals} />

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <p className="text-gray-700 leading-relaxed">
                    {restaurant.description}
                </p>
            </div>

            <div className="pt-4">
                <a
                    href={restaurant.reservation_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    Make a Reservation
                </a>
            </div>
        </div>
    );
};
