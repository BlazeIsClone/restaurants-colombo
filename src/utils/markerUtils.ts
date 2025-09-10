import { RestaurantType } from "@/types/marker";

export const createCustomMarkerIcon = (type: string, size: number = 32) => {
    const restaurantType = type as RestaurantType;
    const configs = {
        cafe: {
            emoji: '☕',
            color: '#8B4513'
        },
        bakery: {
            emoji: '🍰',
            color: '#D2691E'
        },
        fine_dining: {
            emoji: '🍴',
            color: '#B8860B'
        },
        casual_dining: {
            emoji: '🍽️',
            color: '#228B22'
        },
        bar: {
            emoji: '🍺',
            color: '#8B0000'
        }
    };

    const config = configs[restaurantType];

    // Create a canvas to render the emoji
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        // Draw white background circle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
        ctx.fill();

        // Draw border
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw emoji
        ctx.font = `${size * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.emoji, size / 2, size / 2);
    }

    return {
        url: canvas.toDataURL(),
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(size / 2, size / 2)
    };
};
