import { Post, IPost, PostStatus, PostPriority } from "../models/Post";
import { ValidityScore } from "../models/ValidityScore";

// In a real app this would talk to a DB (Prisma / pg).
// For now it's an in-memory store so the class structure is demonstrable.
// Swap the store calls with DB queries when Neeraj's db.ts is ready.

interface CreatePostDTO {
  userId: string;
  title: string;
  body?: string;
  category: string;
  priority?: PostPriority;
  tags?: string[];
  isAnonymous?: boolean;
}

interface UpdatePostDTO {
  title?: string;
  body?: string;
  category?: string;
  priority?: PostPriority;
  tags?: string[];
}

// In-memory store (replace with DB later)
const postStore = new Map<string, Post>();
const validityStore = new Map<string, ValidityScore>(); // postId → score
const voteTracker = new Map<string, Set<string>>();     // postId → Set<userId>

export class PostService {

  // ─── CREATE ────────────────────────────────────────────────────────────────

  createPost(dto: CreatePostDTO): Post {
    const post = new Post({
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
      category: dto.category,
      priority: dto.priority ?? PostPriority.MEDIUM,
      tags: dto.tags ?? [],
      isAnonymous: dto.isAnonymous ?? false,
    });

    // initialise a blank validity score for this post
    const vs = new ValidityScore(post.postId, 0, 0);
    post.validityScore = vs.scoreId;

    postStore.set(post.postId, post);
    validityStore.set(post.postId, vs);
    voteTracker.set(post.postId, new Set());

    return post;
  }

  // ─── READ ──────────────────────────────────────────────────────────────────

  getPostById(postId: string): Post {
    const post = postStore.get(postId);
    if (!post) throw new Error(`Post ${postId} not found`);
    return post;
  }

  getAllPosts(): Post[] {
    return Array.from(postStore.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getPostsByUser(userId: string): Post[] {
    return this.getAllPosts().filter((p) => p.userId === userId);
  }

  getPostsByCategory(category: string): Post[] {
    return this.getAllPosts().filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  getPostsByStatus(status: PostStatus): Post[] {
    return this.getAllPosts().filter((p) => p.status === status);
  }

  getValidityScore(postId: string): ValidityScore | undefined {
    return validityStore.get(postId);
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────

  updatePost(postId: string, dto: UpdatePostDTO, requestingUserId: string): Post {
    const post = this.getPostById(postId);

    // only the author can edit their own post
    if (post.userId !== requestingUserId) {
      throw new Error("Unauthorized: you can only edit your own posts");
    }

    if (dto.title) post.title = dto.title;
    if (dto.body !== undefined) post.body = dto.body;
    if (dto.category) post.category = dto.category;
    if (dto.priority) post.priority = dto.priority;
    if (dto.tags) post.tags = dto.tags;
    post.touch();

    postStore.set(postId, post);
    return post;
  }

  changeStatus(postId: string, newStatus: PostStatus): Post {
    const post = this.getPostById(postId);
    post.changeStatus(newStatus);
    postStore.set(postId, post);
    return post;
  }

  assignPost(postId: string, staffId: string): Post {
    const post = this.getPostById(postId);
    post.assign(staffId);
    postStore.set(postId, post);
    return post;
  }

  // ─── VOTES ─────────────────────────────────────────────────────────────────

  upvote(postId: string, userId: string): { post: Post; validityScore: ValidityScore } {
    const post = this.getPostById(postId);
    const voters = voteTracker.get(postId) ?? new Set();

    if (voters.has(userId)) {
      throw new Error("You have already voted on this post");
    }

    post.upvote();
    voters.add(userId);
    voteTracker.set(postId, voters);
    postStore.set(postId, post);

    const vs = this.refreshValidityScore(post);
    return { post, validityScore: vs };
  }

  downvote(postId: string, userId: string): { post: Post; validityScore: ValidityScore } {
    const post = this.getPostById(postId);
    const voters = voteTracker.get(postId) ?? new Set();

    if (voters.has(userId)) {
      throw new Error("You have already voted on this post");
    }

    post.downvote();
    voters.add(userId);
    voteTracker.set(postId, voters);
    postStore.set(postId, post);

    const vs = this.refreshValidityScore(post);
    return { post, validityScore: vs };
  }

  private refreshValidityScore(post: Post): ValidityScore {
    const vs = validityStore.get(post.postId);
    if (!vs) throw new Error("ValidityScore not found for post");
    vs.recalculate(post.upvotes, post.downvotes);
    validityStore.set(post.postId, vs);
    return vs;
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────

  deletePost(postId: string, requestingUserId: string, isAdmin: boolean): void {
    const post = this.getPostById(postId);

    if (!isAdmin && post.userId !== requestingUserId) {
      throw new Error("Unauthorized: cannot delete another user's post");
    }

    postStore.delete(postId);
    validityStore.delete(postId);
    voteTracker.delete(postId);
  }
}

// Export a singleton so all routes share the same in-memory state
export const postService = new PostService();