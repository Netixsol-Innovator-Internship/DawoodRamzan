"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { useGetAllReviewsQuery } from "@/lib/services/reviewsApi"; // ✅ RTK Query hook
import { formatDistanceToNow } from "date-fns";

export default function ReviewsSlider() {
  // ✅ Fetch reviews from API
  const { data: reviews = [], isLoading, error } = useGetAllReviewsQuery();

  console.log("Reviews API response 👉", reviews);

  // index refers to first visible slide
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef(false);

  // Determine how many cards fit (1 / 2 / 3 / 4 / 5)
  const computeVisible = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 1280) return 5;
    if (w >= 1024) return 4;
    if (w >= 640) return 2;
    return 1;
  }, []);

  useEffect(() => {
    setVisibleCount(computeVisible());
    const handle = () => setVisibleCount(computeVisible());
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [computeVisible]);

  const maxIndex = Math.max(reviews.length - visibleCount, 0);

  const clamp = useCallback(
    (i: number) => {
      if (i < 0) return maxIndex;
      if (i > maxIndex) return 0;
      return i;
    },
    [maxIndex]
  );

  const goTo = useCallback((i: number) => setIndex(clamp(i)), [clamp]);
  const next = useCallback(() => setIndex((prev) => clamp(prev + 1)), [clamp]);
  const prev = useCallback(() => setIndex((prev) => clamp(prev - 1)), [clamp]);

  // Scroll to current index
  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const child = track.children[index] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({
      left: child.offsetLeft,
      behavior: interactionRef.current ? "smooth" : "auto",
    });
  }, [index, visibleCount]);

  // Autoplay
  useEffect(() => {
    const id = setInterval(() => {
      if (!interactionRef.current) next();
    }, 6000);
    return () => clearInterval(id);
  }, [next]);

  // Pause autoplay
  const pause = () => {
    interactionRef.current = true;
  };
  const resume = () => {
    interactionRef.current = false;
  };

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      interactionRef.current = true;
      next();
    } else if (e.key === "ArrowLeft") {
      interactionRef.current = true;
      prev();
    }
  };

  // Drag / swipe
  const pointer = useRef<{
    startX: number;
    scrollLeft: number;
    active: boolean;
  } | null>(null);

  const startDrag = (x: number) => {
    if (!trackRef.current) return;
    pointer.current = {
      startX: x,
      scrollLeft: trackRef.current.scrollLeft,
      active: true,
    };
    interactionRef.current = true;
  };
  const moveDrag = (x: number) => {
    if (!pointer.current?.active || !trackRef.current) return;
    const delta = x - pointer.current.startX;
    trackRef.current.scrollLeft = pointer.current.scrollLeft - delta;
  };
  const endDrag = () => {
    if (!pointer.current || !trackRef.current) return;
    const track = trackRef.current;
    const children = Array.from(track.children) as HTMLElement[];
    let closest = index;
    let min = Infinity;
    children.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - track.scrollLeft);
      if (d < min) {
        min = d;
        closest = i;
      }
    });
    setIndex(clamp(closest));
    pointer.current.active = false;
    setTimeout(() => {
      interactionRef.current = false;
    }, 2500);
  };

  return (
    <section
      className="py-16"
      aria-label="Customer testimonials carousel"
      onKeyDown={onKeyDown}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-black">
            OUR HAPPY CUSTOMERS
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => {
                interactionRef.current = true;
                prev();
              }}
              className="h-9 w-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => {
                interactionRef.current = true;
                next();
              }}
              className="h-9 w-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition"
            >
              →
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {isLoading && <p className="text-center">Loading reviews...</p>}
        {error && (
          <p className="text-center text-red-500">Failed to load reviews.</p>
        )}

        {!isLoading && !error && reviews.length > 0 && (
          <div
            className="relative"
            onMouseEnter={pause}
            onMouseLeave={resume}
            onFocus={pause}
            onBlur={resume}
          >
            <div
              ref={trackRef}
              role="list"
              aria-live="polite"
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pl-6 pr-6 lg:pl-12 lg:pr-12 xl:pl-28 xl:pr-28
                         select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                startDrag(e.clientX);
              }}
              onPointerMove={(e) => moveDrag(e.clientX)}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onTouchStart={(e) => startDrag(e.touches[0].clientX)}
              onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
              onTouchEnd={endDrag}
            >
              {reviews.map((r, i) => (
                <article
                  key={r._id || i}
                  role="listitem"
                  aria-label={`Testimonial ${i + 1} of ${reviews.length}`}
                  tabIndex={0}
                  className="snap-center shrink-0 w-[85%] sm:w-[48%] md:w-[33.333%] lg:w-[20%] xl:w-[18%] bg-white p-6 rounded-xl border border-gray-200 shadow-sm
                             transition-shadow hover:shadow-md focus-within:shadow-md"
                >
                  {/* Stars */}
                  <div
                    className="flex items-center gap-1 mb-3"
                    aria-label={`${r.rating} star rating`}
                  >
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star
                        key={j}
                        className={`w-5 h-5 ${
                          j < (r.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* User name */}
                  <p className="font-semibold text-black">
                    {r.userId?.username || "Anonymous"}
                  </p>

                  {/* Product name (optional) */}
                  {r.productId?.name && (
                    <p className="text-xs text-gray-500">
                      on <span className="italic">{r.productId.name}</span>
                    </p>
                  )}

                  {/* Review message */}
                  <p className="text-gray-600 leading-relaxed text-sm mt-2">
                    {r.message}
                  </p>

                  {/* Time ago */}
                  <p className="text-xs text-gray-400 mt-3">
                    {r.createdAt
                      ? formatDistanceToNow(new Date(r.createdAt), {
                          addSuffix: true,
                        })
                      : ""}
                  </p>
                </article>
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({
                length: Math.max(reviews.length - visibleCount + 1, 1),
              }).map((_, dot) => {
                const active = index === dot;
                return (
                  <button
                    key={dot}
                    aria-label={`Go to slide ${dot + 1}`}
                    onClick={() => {
                      interactionRef.current = true;
                      goTo(dot);
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      active
                        ? "bg-black"
                        : "bg-gray-300 hover:bg-gray-400 focus-visible:bg-gray-500"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
