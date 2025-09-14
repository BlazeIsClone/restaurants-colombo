import { RestaurantType } from "./marker";

export interface Restaurant {
    id: string;
    name: string;
    type: RestaurantType;
    lat: number;
    lng: number;
    main_image: string;
    gallery: string[];
    opening_hours: {
        days: string[];
        hours: string;
    };
    address: string;
    rating: number;
    perfect_for: string[];
    deal: string;
    description: string;
    reservation_link: string;
}
