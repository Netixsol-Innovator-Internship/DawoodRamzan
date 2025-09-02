export interface Auction {
  _id: string;
  car: string; // just the car ID
  status: "active" | "completed" | "expired";
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  currentBid?: string; // bid ID
  bids?: string[]; // array of bid IDs
  bidCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
