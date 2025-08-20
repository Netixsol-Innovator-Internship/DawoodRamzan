import { create } from "zustand";

export interface Game {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description?: string;
  category: string;
  isFree?: boolean;
  freeUntil?: string;
  isPreOrder?: boolean;
  comingSoon?: boolean;
}

interface GameStore {
  games: Game[];
  featuredGame: Game | null;
  selectedGame: Game | null; // ✅ used for HeroSection sidebar
  freeGames: Game[];
  topSellers: Game[];
  bestSellers: Game[];
  upcomingGames: Game[];
  gamesOnSale: Game[];

  setGames: (games: Game[]) => void;
  setFeaturedGame: (game: Game) => void;
  setSelectedGame: (game: Game) => void; // ✅ for sidebar click
}

export const useGameStore = create<GameStore>((set) => ({
  games: [],
  featuredGame: null,
  selectedGame: {
    id: "0",
    title: "God Of War 4",
    image: "/her.jpg",
    description:
      "Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive.",
    category: "Action",
    price: 0,
  },
  freeGames: [],
  topSellers: [],
  bestSellers: [],
  upcomingGames: [],
  gamesOnSale: [],

  setGames: (games) => set({ games }),
  setFeaturedGame: (game) => set({ featuredGame: game }),
  setSelectedGame: (game) => set({ selectedGame: game }),
}));

// ✅ Mock data
export const mockGames: Game[] = [
  {
    id: "1",
    title: "God of War 4",
    image: "/god.jpg",
    price: 2659,
    description:
      "Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive",
    category: "Action",
    isPreOrder: true,
  },
  {
    id: "2",
    title: "Valorant",
    image: "/Valorant.jpg",
    price: 850,
    originalPrice: 900,
    discount: 10,
    category: "FPS",
  },
  {
    id: "3",
    title: "Assassin's Creed Valhalla",
    image: "/assasinsCreed.jpg",
    price: 2999,
    originalPrice: 3349,
    discount: 20,
    category: "Action",
  },
  {
    id: "4",
    title: "Red Dead Redemption 2",
    image: "/Red.jpg",
    price: 1599,
    originalPrice: 3199,
    discount: 50,
    category: "Action",
  },
  {
    id: "5",
    title: "Cyberpunk 2077",
    image: "/Cyberpunk.jpg",
    price: 2000,
    originalPrice: 4000,
    discount: 50,
    category: "RPG",
  },
  {
    id: "6",
    title: "The Tomb Raider",
    image: "/tombRaider.jpg",
    price: 2200,
    originalPrice: 2195,
    discount: 20,
    category: "Adventure",
  },
  {
    id: "7",
    title: "Darkwood",
    image: "/Darkwood.jpg",
    price: 0,
    isFree: true,
    freeUntil: "Jul 25",
    category: "Horror",
  },
  {
    id: "8",
    title: "Assassin's Creed Black Flag",
    image: "/assasinsCreed.jpg",
    price: 0,
    isFree: true,
    freeUntil: "Jul 25",
    category: "Action",
  },
  {
    id: "9",
    title: "NFS: Shift",
    image: "/Shift.jpg",
    price: 0,
    isFree: true,
    freeUntil: "Aug 5",
    category: "Racing",
  },
  {
    id: "10",
    title: "Warface",
    image: "/Warface.jpg",
    price: 0,
    isFree: true,
    freeUntil: "Aug 5",
    category: "FPS",
  },
  {
    id: "11",
    title: "FIFA 23",
    image: "/fifa.jpg",
    price: 3699,
    category: "Sports",
  },
  {
    id: "12",
    title: "Uncharted 4",
    image: "/Uncharted.jpg",
    price: 2199,
    category: "Adventure",
  },
  {
    id: "13",
    title: "NFS Unbound",
    image: "/Unbound.jpg",
    price: 3499,
    category: "Racing",
  },
];
