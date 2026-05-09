"use client";

import { useRef, useState, useCallback } from "react";

export type SnapPoint = "collapsed" | "peek" | "full";

interface BottomSheetProps {
  title: string;
  children: React.ReactNode;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  snap: SnapPoint;
  onSnapChange: (snap: SnapPoint) => void;
}

function getSnapHeightPx(point: SnapPoint): number {
  const vh = window.innerHeight;
  switch (point) {
    case "collapsed": return 72;
    case "peek": return vh * 0.45;
    case "full": return vh * 0.92;
  }
}

export const BottomSheet = ({
  title,
  children,
  scrollRef,
  snap,
  onSnapChange,
}: BottomSheetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragHeight, setDragHeight] = useState<number | null>(null);

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const snapTo = useCallback(
    (point: SnapPoint) => {
      setDragHeight(null);
      setIsDragging(false);
      onSnapChange(point);
    },
    [onSnapChange]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      dragStartY.current = e.touches[0].clientY;
      dragStartHeight.current =
        sheetRef.current?.getBoundingClientRect().height ?? getSnapHeightPx(snap);
      setIsDragging(true);
    },
    [snap]
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dy = dragStartY.current - e.touches[0].clientY;
    const newHeight = Math.max(
      60,
      Math.min(window.innerHeight * 0.95, dragStartHeight.current + dy)
    );
    setDragHeight(newHeight);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const current = dragHeight ?? getSnapHeightPx(snap);
    const points: SnapPoint[] = ["collapsed", "peek", "full"];
    const nearest = points.reduce((best, point) => {
      const d = Math.abs(current - getSnapHeightPx(point));
      return d < Math.abs(current - getSnapHeightPx(best)) ? point : best;
    });
    snapTo(nearest);
  }, [dragHeight, snap, snapTo]);

  const heightValue =
    dragHeight !== null
      ? `${dragHeight}px`
      : snap === "collapsed"
      ? "72px"
      : snap === "peek"
      ? "45vh"
      : "92vh";

  return (
    <div
      ref={sheetRef}
      className={`fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-2xl shadow-2xl flex flex-col ${
        !isDragging ? "bottom-sheet-transitioning" : ""
      }`}
      style={{ height: heightValue }}
    >
      {/* Drag handle */}
      <div
        className="flex-shrink-0 pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center mb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="px-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 truncate pr-2">
            {title}
          </span>
          {snap !== "full" && (
            <button
              onClick={() => snapTo("full")}
              className="text-xs text-gray-400 hover:text-gray-700 flex-shrink-0 transition-colors"
            >
              Show all ↑
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pb-6"
        style={{ display: snap === "collapsed" ? "none" : "block" }}
      >
        {children}
      </div>
    </div>
  );
};
