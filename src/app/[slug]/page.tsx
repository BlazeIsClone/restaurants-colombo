"use client";

import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { useCallback, useState, useEffect, useRef, use, useMemo } from "react";
import { RestaurantDetails } from "@/components/RestaurantDetails";
import { Restaurant as RestaurantT } from "@/types/restaurant";
import restaurants from "@/data/restaurants.json";
import articles from "@/data/articles.json";
import mapConfig from "@/data/map.json";

export default function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [map, setMap] = useState<google.maps.Map | null>();
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 79.8612 });
  const [mapZoom, setMapZoom] = useState(12);
  const [isClient, setIsClient] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { slug } = use(params);

  // Check if this is an article or a restaurant
  const article = articles.find((a) => a.id === slug);
  const restaurant = restaurants.find((r) => r.id === slug);

  // Get restaurants to display
  const restaurantsToShow = useMemo(() => {
    return article
      ? restaurants.filter((r) => article.featured_restaurants.includes(r.id))
      : restaurant
      ? [restaurant]
      : [];
  }, [article, restaurant]);

  const onLoad = useCallback((map: google.maps.Map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const focusMapOnRestaurant = useCallback(
    (id: string) => {
      const restaurant = restaurantsToShow.find((r) => r.id === id);
      if (!restaurant) return;

      // Update map center and zoom state
      setMapCenter({ lat: restaurant.lat, lng: restaurant.lng });
      setMapZoom(17);
    },
    [restaurantsToShow]
  );

  const handleMarkerClick = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // Set as active restaurant and focus map
    setActiveRestaurantId(id);
    focusMapOnRestaurant(id);
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Please set your Google Maps API key in the .env file");
  }

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Simple scroll handler
  useEffect(() => {
    if (!isLoaded || !map) return;

    // Set initial focus on first restaurant
    if (!activeRestaurantId && restaurantsToShow.length > 0) {
      const firstRestaurant = restaurantsToShow[0];
      setActiveRestaurantId(firstRestaurant.id);
      focusMapOnRestaurant(firstRestaurant.id);
    }

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollContainer = document.querySelector(".overflow-y-scroll");
        if (!scrollContainer) return;

        const containerRect = scrollContainer.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;

        let closestRestaurant = null;
        let minDistance = Infinity;

        restaurantsToShow.forEach((restaurant) => {
          const element = document.getElementById(restaurant.id);
          if (!element) return;

          const elementRect = element.getBoundingClientRect();
          const elementCenter = elementRect.top + elementRect.height / 2;
          const distance = Math.abs(elementCenter - containerCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestRestaurant = restaurant.id;
          }
        });

        if (closestRestaurant && closestRestaurant !== activeRestaurantId) {
          setActiveRestaurantId(closestRestaurant);
          focusMapOnRestaurant(closestRestaurant);
        }
      }, 150);
    };

    const scrollContainer = document.querySelector(".overflow-y-scroll");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [
    isLoaded,
    map,
    focusMapOnRestaurant,
    activeRestaurantId,
    restaurantsToShow,
  ]);

  if (!isClient || !isLoaded) {
    return (
      <div className="container mx-auto px-4 flex h-screen">
        <article className="w-[50%] overflow-y-scroll pe-10 border-r border-gray-300">
          <div className="mb-4">
            <h1 className="my-2 text-2xl font-semibold">Loading...</h1>
          </div>
        </article>
      </div>
    );
  }

  // If neither article nor restaurant found, show 404
  if (!article && !restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-600">The requested page could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 flex h-screen">
      <article className="w-[50%] overflow-y-scroll pe-10 border-r border-gray-300">
        <div className="mb-4">
          {article ? (
            <div className="border-b border-b-gray-300 py-4">
              <h1 className="my-2 text-2xl font-semibold">{article.title}</h1>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{article.featured_restaurants.length} restaurants</span>
              </div>
            </div>
          ) : (
            <h1 className="my-2 text-2xl font-semibold">{restaurant?.name}</h1>
          )}
        </div>
        {restaurantsToShow.map((restaurant) => (
          <div
            key={restaurant.id}
            id={restaurant.id}
            className="restaurant my-6 pb-6 border-b border-b-gray-300 bg-white transition-all duration-300"
          >
            <RestaurantDetails
              restaurant={restaurant as RestaurantT}
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
            styles: mapConfig,
          }}
          center={mapCenter}
          zoom={mapZoom}
        >
          {restaurantsToShow.map((restaurant) => (
            <HTMLMarker
              key={restaurant.id}
              position={{ lat: restaurant.lat, lng: restaurant.lng }}
              isActive={activeRestaurantId === restaurant.id}
              onClick={() => handleMarkerClick(restaurant.id)}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

function HTMLMarker({
  position,
  isActive,
  onClick,
}: {
  position: { lat: number; lng: number };
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
          isActive ? "scale-110 z-10" : "scale-100 z-0"
        }`}
        style={{
          width: isActive ? "40px" : "30px",
          height: isActive ? "40px" : "30px",
        }}
        onClick={onClick}
      >
        <div
          className={`w-full h-full rounded-full border-2 flex items-center justify-center ${
            isActive
              ? "bg-black border-black shadow-lg"
              : "bg-black border-black shadow-md"
          }`}
        >
          <div className="w-1/3 h-1/3 bg-white rounded-full"></div>
        </div>
        {isActive && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 -translate-t-1/2
              w-0 h-0 border-l-4 border-r-4 border-t-6
              border-l-transparent border-r-transparent border-t-black"
          ></div>
        )}
      </div>
    </OverlayView>
  );
}
