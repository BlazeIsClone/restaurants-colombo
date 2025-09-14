"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState } from "react";
import restaurants from "@/data/restaurants.json";
import { RestaurantDetails } from "./RestaurantDetails";
import { Restaurant } from "@/types/restaurant";

export const Map = () => {
  const [map, setMap] = useState<google.maps.Map | null>();

  const onLoad = useCallback((map: google.maps.Map) => setMap(map), []);

  const onUnmount = useCallback(() => setMap(null), []);

  const handleMarkerClick = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    if (map) {
      map.setZoom(17);
      map.panTo({
        lat:
          restaurants.find((restaurant) => {
            return restaurant.id === id;
          })?.lat ?? 0.0,
        lng:
          restaurants.find((restaurant) => {
            return restaurant.id === id;
          })?.lng ?? 0.0,
      });
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Please set your Google Maps API key in the .env file");
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 flex h-screen">
      <article className="w-[50%] overflow-y-scroll p-4 border-r border-gray-300">
        <div className="mb-4">
          <h1 className="mb-2 text-2xl font-semibold">
            Highest Rated Restaurants In Colombo
          </h1>
        </div>
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            id={restaurant.id}
            className={`restaurant my-6 p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200`}
          >
            <RestaurantDetails
              restaurant={restaurant as Restaurant}
              onNameClick={() => handleMarkerClick(restaurant.id)}
            />
          </div>
        ))}
      </article>

      <div className="right-0 absolute w-[50%]">
        <GoogleMap
          onLoad={onLoad}
          onUnmount={onUnmount}
          mapContainerStyle={{ width: "100%", height: "100vh" }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: "poi.business",
                elementType: "geometry",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "poi.place_of_worship",
                elementType: "geometry",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "poi.school",
                elementType: "geometry",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "poi.sports_complex",
                elementType: "geometry",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                  {
                    visibility: "simplified",
                  },
                ],
              },
            ],
          }}
          center={{ lat: 6.9271, lng: 79.8612 }}
          zoom={12}
        >
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{ lat: restaurant.lat, lng: restaurant.lng }}
              onClick={() => handleMarkerClick(restaurant.id)}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};
