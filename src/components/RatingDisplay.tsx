interface RatingDisplayProps {
  rating: number;
}

export const RatingDisplay = ({ rating }: RatingDisplayProps) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <div
        className={`bg-blue-500 text-white px-3 py-1 shadow-lg flex items-center space-x-1`}
      >
        <span className="font-bold text-lg">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
};
