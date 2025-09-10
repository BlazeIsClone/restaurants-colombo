import { RestaurantType } from "@/types/marker";

interface RestaurantIconProps {
    type: RestaurantType;
    size?: number;
    color?: string;
}

const getIconConfig = (type: RestaurantType) => {
    const configs = {
        cafe: {
            color: '#8B4513', // Brown
            hoverColor: '#A0522D',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 3H4v2h16V3zm0 4H4v2h16V7zm-2 4H6v8h12v-8zm-2 2H8v4h8v-4z" />
                    <path d="M8 5h2v2H8V5zm6 0h2v2h-2V5z" />
                    <circle cx="12" cy="9" r="1" />
                </svg>
            )
        },
        bakery: {
            color: '#D2691E', // Chocolate
            hoverColor: '#CD853F',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
            )
        },
        fine_dining: {
            color: '#B8860B', // Dark goldenrod
            hoverColor: '#DAA520',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
                    <path d="M5 5h2v2H5V5zm6 0h2v2h-2V5zm6 0h2v2h-2V5z" />
                    <path d="M5 9h2v2H5V9zm6 0h2v2h-2V9zm6 0h2v2h-2V9z" />
                </svg>
            )
        },
        casual_dining: {
            color: '#228B22', // Forest green
            hoverColor: '#32CD32',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <ellipse cx="12" cy="8" rx="8" ry="3" />
                    <path d="M4 8v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8H4z" />
                    <path d="M6 10h2v4H6v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4z" />
                </svg>
            )
        },
        bar: {
            color: '#8B0000', // Dark red
            hoverColor: '#DC143C',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="12" height="16" rx="2" />
                    <path d="M8 6h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z" />
                    <circle cx="12" cy="8" r="1" />
                </svg>
            )
        }
    };

    return configs[type];
};

export const RestaurantIcon = ({ type, size = 32, color }: RestaurantIconProps) => {
    const config = getIconConfig(type);
    const iconColor = color || config.color;

    return (
        <div
            style={{
                width: size,
                height: size,
                color: iconColor,
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                border: '2px solid white'
            }}
        >
            <div style={{ width: size * 0.6, height: size * 0.6 }}>
                {config.icon}
            </div>
        </div>
    );
};
