export type ListingStatus = "active" | "sold" | "reserved";

export type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  seller: string;
  sellerId?: string;
  sellerRating?: number;
  sellerReviews?: number;
  campus: string;
  condition: string;
  image: string;
  description?: string;
  status?: ListingStatus;
  createdAt?: number;
  isPopular?: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
};

export type Conversation = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  sellerId: string;
  participantName: string;
  participantCampus: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: Message[];
};

export type PriceFilter = "all" | "under25" | "25to50" | "50to100" | "100plus";
export type SortOption = "newest" | "price-asc" | "price-desc";

export type UserRole = "student" | "admin";

export type StudentUser = {
  uid: string;
  fullName: string;
  studentId: string;
  email: string;
  faculty: string;
  role: UserRole;
  isBanned?: boolean;
  createdAt?: number | string;
};

export type ReportItem = {
  id: string;
  listingId: string;
  listingTitle: string;
  reportedBy: string;
  reportedByName?: string;
  reason: string;
  details?: string;
  createdAt: number;
  status: "pending" | "resolved" | "dismissed";
};

export type Tab = "Explore" | "Saved" | "Messages" | "Profile" | "MyListings" | "Admin";
