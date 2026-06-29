"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Review = {
  id: string;
  productId: number;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
};

type ReviewsContextValue = {
  getReviews: (productId: number) => Review[];
  addReview: (data: Omit<Review, "id" | "date" | "helpful" | "notHelpful" | "verified">) => void;
  voteHelpful: (id: string, vote: "up" | "down") => void;
};

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

const KEY = "stryde_reviews";

/* ── Seed data ─────────────────────────────────────────── */
const SEEDS: Review[] = [
  // Air Vortex Pro (id 1)
  { id: "s1",  productId: 1, author: "James R.",   rating: 5, title: "Best running shoe I've ever worn",   body: "I've been running marathons for 10 years and these are a game-changer. The energy return on each step is unlike anything I've tried. My 5K PB dropped by 40 seconds.",                       date: "2026-05-12", verified: true,  helpful: 24, notHelpful: 1 },
  { id: "s2",  productId: 1, author: "Priya S.",   rating: 5, title: "Lightweight and incredibly responsive", body: "Ordered these for trail running but ended up wearing them everywhere. The fit is snug without being tight, and they look amazing too.",                                               date: "2026-04-28", verified: true,  helpful: 18, notHelpful: 0 },
  { id: "s3",  productId: 1, author: "Tom W.",     rating: 4, title: "Great shoe, runs slightly narrow",    body: "Love everything about the shoe — cushioning, looks, durability. Only minor gripe is it runs a bit narrow. Would recommend sizing up half a size if you have wider feet.",               date: "2026-04-10", verified: true,  helpful: 11, notHelpful: 2 },
  { id: "s4",  productId: 1, author: "Clara D.",   rating: 5, title: "My go-to for long runs",             body: "I do 80km+ weeks and these hold up beautifully. No hot spots, no blisters. The reflective details are a great bonus for early morning runs.",                                         date: "2026-03-22", verified: false, helpful: 8,  notHelpful: 0 },

  // Urban Runner X (id 2)
  { id: "s5",  productId: 2, author: "Marcus T.",  rating: 5, title: "Street perfection",                  body: "These are exactly what I wanted — clean silhouette, comfortable all day, and the sale price was insane. Already ordered a second pair in a different colour.",                       date: "2026-05-20", verified: true,  helpful: 31, notHelpful: 1 },
  { id: "s6",  productId: 2, author: "Aisha K.",   rating: 4, title: "Great casual shoe",                  body: "Comfortable right out of the box, no break-in needed. The sole is a little less padded than I expected but for everyday wear it's perfect.",                                          date: "2026-05-01", verified: true,  helpful: 14, notHelpful: 3 },
  { id: "s7",  productId: 2, author: "Leo B.",     rating: 3, title: "Nice but runs big",                  body: "Stylish shoe but I'd recommend going half a size down. The material quality is good though and they've gotten more comfortable after a few wears.",                                   date: "2026-04-15", verified: true,  helpful: 9,  notHelpful: 1 },

  // Classic Luxe (id 3)
  { id: "s8",  productId: 3, author: "Sophia K.",  rating: 5, title: "Worth every penny",                  body: "I was hesitant at the price point but these are genuinely premium. The leather is buttery soft and the memory foam insole makes them the most comfortable shoe I own.",               date: "2026-05-18", verified: true,  helpful: 42, notHelpful: 0 },
  { id: "s9",  productId: 3, author: "David M.",   rating: 5, title: "Gets better with every wear",       body: "Three months in and these have moulded perfectly to my feet. The craftsmanship is exceptional — you can tell these are built to last years, not seasons.",                               date: "2026-05-02", verified: true,  helpful: 37, notHelpful: 2 },
  { id: "s10", productId: 3, author: "Nina J.",    rating: 5, title: "My favourite shoes of all time",     body: "I own 4 pairs of these now in different colourways. The quality is consistent every time. Cream is my personal favourite — goes with everything.",                                    date: "2026-04-21", verified: true,  helpful: 29, notHelpful: 0 },
  { id: "s11", productId: 3, author: "Hassan O.",  rating: 4, title: "Excellent but slightly stiff at first", body: "Takes about a week to break in but after that they're incredible. Definitely invest the time — it's worth it.",                                                                  date: "2026-03-30", verified: false, helpful: 15, notHelpful: 1 },

  // Street Edge V2 (id 4)
  { id: "s12", productId: 4, author: "Tyler C.",   rating: 5, title: "Chunky done right",                  body: "The platform is big enough to make a statement but not so heavy you feel it. These are genuinely comfortable for all-day wear. The waterproofing is a great bonus.",                  date: "2026-05-08", verified: true,  helpful: 19, notHelpful: 0 },
  { id: "s13", productId: 4, author: "Emma L.",    rating: 4, title: "Great build quality",                body: "Solid shoe. The reinforced toe cap gives me confidence to wear these anywhere. Wish there were more colourways available.",                                                          date: "2026-04-19", verified: true,  helpful: 12, notHelpful: 2 },

  // Cloud Walk Elite (id 5)
  { id: "s14", productId: 5, author: "Rebecca F.", rating: 5, title: "Actually feels like walking on clouds", body: "I know that's a cliché but I have plantar fasciitis and these are the only shoes I can wear all day without pain. The CloudFoam technology is real.",                           date: "2026-05-22", verified: true,  helpful: 38, notHelpful: 1 },
  { id: "s15", productId: 5, author: "Owen K.",    rating: 5, title: "Limited for a reason — don't miss out", body: "Grabbed mine on the first drop. The knit upper is so comfortable and the carbon plate gives an obvious boost when running. These will sell out fast.",                            date: "2026-05-10", verified: true,  helpful: 27, notHelpful: 0 },

  // Trail Blazer GTX (id 6)
  { id: "s16", productId: 6, author: "Sam P.",     rating: 5, title: "Survived a full hiking weekend",     body: "Wore these for 3 days straight on a hiking trip in Scotland. Completely waterproof even in constant rain. Grip on wet rock and mud is excellent.",                                   date: "2026-05-15", verified: true,  helpful: 33, notHelpful: 1 },
  { id: "s17", productId: 6, author: "Fatima A.",  rating: 4, title: "Excellent trail shoe",               body: "Great grip, great waterproofing. A little heavy compared to my other trail shoes but the protection you get in return is worth the trade-off.",                                     date: "2026-04-25", verified: true,  helpful: 21, notHelpful: 3 },
  { id: "s18", productId: 6, author: "Chris N.",   rating: 5, title: "The most durable trail shoe I've used", body: "6 months of hard trail use and these still look and perform like new. The outsole lugs haven't worn down at all. Incredible build quality.",                                   date: "2026-03-14", verified: true,  helpful: 28, notHelpful: 0 },

  // Velocity Sprint (id 7)
  { id: "s19", productId: 7, author: "Ava M.",     rating: 4, title: "Fastest shoe in my rotation",        body: "The 4mm drop took a bit of getting used to but once I adapted my form these became my go-to for tempo runs and races. Lightweight and fast.",                                        date: "2026-05-19", verified: true,  helpful: 17, notHelpful: 1 },
  { id: "s20", productId: 7, author: "Jake T.",    rating: 5, title: "Amazing at the sale price",          body: "Was going to buy a competitor's racing flat for double the price. These are every bit as good. The sock-like knit upper fits perfectly — zero heel slippage.",                      date: "2026-05-03", verified: true,  helpful: 22, notHelpful: 0 },

  // Night Runner Dark (id 8)
  { id: "s21", productId: 8, author: "Lena V.",    rating: 5, title: "Turns heads at night",               body: "The 360° reflective detailing is stunning under streetlights. I get compliments every single run. But beyond the looks, the performance is genuinely excellent too.",                date: "2026-05-24", verified: true,  helpful: 14, notHelpful: 0 },
  { id: "s22", productId: 8, author: "Ryan O.",    rating: 5, title: "Perfect night running shoe",         body: "Visibility was my main concern for night runs and these completely solved it. The secure lace system never comes undone even on technical routes. Highly recommend.",                  date: "2026-04-30", verified: true,  helpful: 19, notHelpful: 1 },
];

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [voted, setVoted]     = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setReviews(JSON.parse(raw));
      } else {
        setReviews(SEEDS);
        localStorage.setItem(KEY, JSON.stringify(SEEDS));
      }
      const v = localStorage.getItem(KEY + "_voted");
      if (v) setVoted(new Set(JSON.parse(v)));
    } catch {}
  }, []);

  const persist = (next: Review[]) => {
    setReviews(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const getReviews = useCallback((productId: number) =>
    reviews.filter((r) => r.productId === productId), [reviews]);

  const addReview = useCallback((data: Omit<Review, "id" | "date" | "helpful" | "notHelpful" | "verified">) => {
    const next: Review = {
      ...data,
      id: `u_${Date.now()}`,
      date: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
      verified: false,
    };
    persist([next, ...reviews]);
  }, [reviews]);

  const voteHelpful = useCallback((id: string, vote: "up" | "down") => {
    if (voted.has(id)) return;
    const next = reviews.map((r) =>
      r.id === id ? { ...r, helpful: vote === "up" ? r.helpful + 1 : r.helpful, notHelpful: vote === "down" ? r.notHelpful + 1 : r.notHelpful } : r
    );
    persist(next);
    const nextVoted = new Set([...voted, id]);
    setVoted(nextVoted);
    localStorage.setItem(KEY + "_voted", JSON.stringify([...nextVoted]));
  }, [reviews, voted]);

  return (
    <ReviewsContext.Provider value={{ getReviews, addReview, voteHelpful }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be inside ReviewsProvider");
  return ctx;
}
