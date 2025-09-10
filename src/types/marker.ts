export type RestaurantType = 'cafe' | 'bakery' | 'fine_dining' | 'casual_dining' | 'bar';

export interface CustomMarkerProps {
    type: RestaurantType;
    size?: number;
    color?: string;
    hoverColor?: string;
}
