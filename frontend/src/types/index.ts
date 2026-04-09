// Shared TypeScript types used across frontend components.
// These mirror the backend models — keep in sync with backend/src/models/

export type UserRole = "student" | "faculty" | "admin";

export type PostStatus =
  | "open"
  | "in_review"
  | "in_progress"
  | "resolved"
  | "closed"
  | "rejected";

export type PostPriority = "low" | "medium" | "high";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  gender: string;
  department: string;
  yearOfStudy: number;
  createdAt: string;
}

export interface Post {
  postId: string;
  userId: string;
  assignedTo?: string;
  title: string;
  body?: string;
  category: string;
  status: PostStatus;
  priority: PostPriority;
  tags: string[];
  upvotes: number;
  downvotes: number;
  validityScore?: string;
  validityScoreData?: ValidityScore;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ValidityScore {
  scoreId: string;
  postId: string;
  score: number;         // 0.0 – 1.0
  totalVotes: number;
  upvotes: number;
  downvotes: number;
  calculatedAt: string;
}

export interface Comment {
  commentId: string;
  complaintId: string;   // FK → Post.postId  (named per whiteboard)
  userId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  announcementId: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}