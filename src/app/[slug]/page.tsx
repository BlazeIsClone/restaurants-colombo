"use client";

import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { useCallback, useState, useEffect, useRef, use, useMemo } from "react";
import Link from "next/link";
import { RestaurantDetails } from "@/components/RestaurantDetails";
import { FilterPills, FilterType } from "@/components/FilterPills";
import { BottomSheet, SnapPoint } from "@/components/BottomSheet";
import { Restaurant as RestaurantT } from "@/types/restaurant";
import { RestaurantType } from "@/types/marker";
import restaurants from "@/data/restaurants.json";
import articles from "@/data/articles.json";
import mapConfig from "@/data/map.json";

export default function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [map, setMap] = useState<google.maps.Map | null>();
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 79.8612 });
  const [mapZoom, setMapZoom] = useState(12);
  const [isClient, setIsClient] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [isMobile, setIsMobile] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SnapPoint>("peek");

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const restaurantsScrollRef = useRef<HTMLDivElement>(null);

  const { slug } = use(params);

  const article = articles.find((a) => a.id === slug);
  const restaurant = restaurants.find((r) => r.id === slug);

  const restaurantsToShow = useMemo(() => {
    return article
      ? restaurants.filter((r) => article.featured_restaurants.includes(r.id))
      : restaurant
      ? [restaurant]
      : [];
  }, [article, restaurant]);

  const availableTypes = useMemo(() => {
    const types = new Set(restaurantsToShow.map((r) => r.type as RestaurantType));
    return Array.from(types);
  }, [restaurantsToShow]);

  const filteredRestaurants = useMemo(() => {
    if (filterType === "all") return restaurantsToShow;
    return restaurantsToShow.filter((r) => r.type === filterType);
  }, [restaurantsToShow, filterType]);

  const onLoad = useCallback((map: google.maps.Map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const focusMapOnRestaurant = useCallback(
    (id: string) => {
      const r = restaurantsToShow.find((r) => r.id === id);
      if (!r) return;
      setMapCenter({ lat: r.lat, lng: r.lng });
      setMapZoom(17);
    },
    [restaurantsToShow]
  );

  const handleMarkerClick = useCallback(
    (id: string) => {
      setActiveRestaurantId(id);
      focusMapOnRestaurant(id);
      if (isMobile) {
        setSheetSnap("full");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 320);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [isMobile, focusMapOnRestaurant]
  );

  const handleFilterChange = useCallback(
    (type: FilterType) => {
      setFilterType(type);
      const next =
        type === "all"
          ? restaurantsToShow
          : restaurantsToShow.filter((r) => r.type === type);
      if (next.length > 0) {
        setActiveRestaurantId(next[0].id);
        focusMapOnRestaurant(next[0].id);
      }
    },
    [restaurantsToShow, focusMapOnRestaurant]
  );

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Please set your Google Maps API key in the .env file");
  }

  useEffect(() => {
    setIsClient(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (!isLoaded || !map) return;

    if (!activeRestaurantId && filteredRestaurants.length > 0) {
      const first = filteredRestaurants[0];
      setActiveRestaurantId(first.id);
      focusMapOnRestaurant(first.id);
    }

    const handleScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        const container = restaurantsScrollRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;

        let closestId: string | null = null;
        let minDist = Infinity;

        filteredRestaurants.forEach((r) => {
          const el = document.getElementById(r.id);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - containerCenter);
          if (dist < minDist) {
            minDist = dist;
            closestId = r.id;
          }
        });

        if (closestId && closestId !== activeRestaurantId) {
          setActiveRestaurantId(closestId);
          focusMapOnRestaurant(closestId);
        }
      }, 150);
    };

    const container = restaurantsScrollRef.current;
    container?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container?.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isLoaded, map, focusMapOnRestaurant, activeRestaurantId, filteredRestaurants, isMobile]);

  if (!isClient || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-7 h-7 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article && !restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 mb-6 block">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-600">The requested page could not be found.</p>
      </div>
    );
  }

  const pageTitle = article ? article.title : (restaurant?.name ?? "");

  const restaurantList = (
    <>
      {availableTypes.length > 1 && (
        <div className="sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
          <FilterPills
            selected={filterType}
            onChange={handleFilterChange}
            availableTypes={availableTypes}
          />
        </div>
      )}
      {filteredRestaurants.map((r) => (
        <div
          key={r.id}
          id={r.id}
          className={`my-6 pb-6 border-b border-b-gray-300 bg-white transition-all duration-300 ${
            activeRestaurantId === r.id
              ? "pl-3 border-l-4 border-l-gray-900"
              : ""
          }`}
        >
          <RestaurantDetails
            restaurant={r as RestaurantT}
            onNameClick={() => handleMarkerClick(r.id)}
          />
        </div>
      ))}
    </>
  );

  const markers = restaurantsToShow.map((r) => (
    <HTMLMarker
      key={r.id}
      name={r.name}
      position={{ lat: r.lat, lng: r.lng }}
      isActive={activeRestaurantId === r.id}
      isFiltered={filterType !== "all" && r.type !== filterType}
      onClick={() => handleMarkerClick(r.id)}
    />
  ));

  // Mobile: full-screen map + bottom sheet
  if (isMobile) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white rounded-full px-3 py-2 shadow-md text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="absolute inset-0">
          <GoogleMap
            onLoad={onLoad}
            onUnmount={onUnmount}
            mapContainerStyle={{ width: "100%", height: "100%" }}
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
            {markers}
          </GoogleMap>
        </div>

        <BottomSheet
          title={pageTitle}
          scrollRef={restaurantsScrollRef}
          snap={sheetSnap}
          onSnapChange={setSheetSnap}
        >
          {article && (
            <div className="py-4 border-b border-gray-200 mb-2">
              <p className="text-xs text-gray-400">{article.featured_restaurants.length} restaurants</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{article.description}</p>
            </div>
          )}
          {restaurantList}
        </BottomSheet>
      </div>
    );
  }

  // Desktop: 50/50 split
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Left panel */}
      <div className="absolute left-0 top-0 bottom-0 w-[50%] flex flex-col border-r border-gray-200 bg-white">
        {/* Top nav bar */}
        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border-b border-gray-200">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0"
          >
            ← Back
          </Link>
          <span className="text-gray-200 select-none">|</span>
          <span className="text-sm font-medium text-gray-900 truncate">{pageTitle}</span>
        </div>

        {/* Scrollable content */}
        <div ref={restaurantsScrollRef} className="flex-1 overflow-y-auto px-5 pr-8">
          {article ? (
            <div className="py-5 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">{article.title}</h1>
              <p className="text-sm text-gray-600 leading-relaxed">{article.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                {article.featured_restaurants.length} restaurants
              </p>
            </div>
          ) : (
            <div className="py-5">
              <h1 className="text-2xl font-semibold text-gray-900">{restaurant?.name}</h1>
            </div>
          )}
          {restaurantList}
        </div>
      </div>

      {/* Right map */}
      <div className="absolute right-0 top-0 w-[50%] h-screen">
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
          {markers}
        </GoogleMap>
      </div>
    </div>
  );
}

function HTMLMarker({
  position,
  isActive,
  isFiltered,
  onClick,
  name,
}: {
  position: { lat: number; lng: number };
  isActive: boolean;
  isFiltered: boolean;
  onClick: () => void;
  name: string;
}) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
          isActive ? "scale-110 z-10" : "scale-100 z-0"
        } ${isFiltered ? "opacity-30" : "opacity-100"}`}
        style={{
          width: isActive ? "40px" : "30px",
          height: isActive ? "40px" : "30px",
        }}
        onClick={onClick}
      >
        {isActive && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
            {name}
          </div>
        )}
        <div
          className={`w-full h-full rounded-full border-2 flex items-center justify-center ${
            isActive
              ? "bg-gray-900 border-gray-900 shadow-lg"
              : "bg-gray-900 border-gray-900 shadow-md"
          }`}
        >
          <div className="w-1/3 h-1/3 bg-white rounded-full" />
        </div>
        {isActive && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2
              w-0 h-0 border-l-4 border-r-4 border-t-[6px]
              border-l-transparent border-r-transparent border-t-gray-900"
          />
        )}
      </div>
    </OverlayView>
  );
}
