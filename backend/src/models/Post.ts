export enum PostStatus {
  OPEN = "open",
  IN_REVIEW = "in_review",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REJECTED = "rejected",
}

export enum PostPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface IPost {
  postId: string;
  userId: string;           // FK → User.userId  (null if anonymous)
  assignedTo?: string;      // FK → User.userId  (admin/staff)
  title: string;
  body?: string;            // optional per whiteboard
  category: string;
  status: PostStatus;
  priority: PostPriority;
  tags: string[];
  upvotes: number;
  downvotes: number;
  validityScore?: string;   // FK → ValidityScore.scoreId
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Post implements IPost {
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
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IPost> & { title: string; category: string; userId: string }) {
    this.postId = data.postId ?? crypto.randomUUID();
    this.userId = data.userId;
    this.assignedTo = data.assignedTo;
    this.title = data.title;
    this.body = data.body;
    this.category = data.category;
    this.status = data.status ?? PostStatus.OPEN;
    this.priority = data.priority ?? PostPriority.MEDIUM;
    this.tags = data.tags ?? [];
    this.upvotes = data.upvotes ?? 0;
    this.downvotes = data.downvotes ?? 0;
    this.validityScore = data.validityScore;
    this.isAnonymous = data.isAnonymous ?? false;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  // touch updatedAt whenever post is mutated
  touch(): void {
    this.updatedAt = new Date();
  }

  upvote(): void {
    this.upvotes += 1;
    this.touch();
  }

  downvote(): void {
    this.downvotes += 1;
    this.touch();
  }

  changeStatus(newStatus: PostStatus): void {
    this.status = newStatus;
    this.touch();
  }

  assign(staffId: string): void {
    this.assignedTo = staffId;
    this.status = PostStatus.IN_PROGRESS;
    this.touch();
  }

  toJSON(): IPost {
    return {
      postId: this.postId,
      userId: this.isAnonymous ? "anonymous" : this.userId,
      assignedTo: this.assignedTo,
      title: this.title,
      body: this.body,
      category: this.category,
      status: this.status,
      priority: this.priority,
      tags: this.tags,
      upvotes: this.upvotes,
      downvotes: this.downvotes,
      validityScore: this.validityScore,
      isAnonymous: this.isAnonymous,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}