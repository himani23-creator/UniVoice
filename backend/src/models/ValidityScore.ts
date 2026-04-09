export interface IValidityScore {
  scoreId: string;
  postId: string;       // FK → Post.postId
  score: number;        // 0.0 – 1.0  (upvotes / total votes)
  totalVotes: number;
  upvotes: number;
  downvotes: number;
  calculatedAt: Date;
}

export class ValidityScore implements IValidityScore {
  scoreId: string;
  postId: string;
  score: number;
  totalVotes: number;
  upvotes: number;
  downvotes: number;
  calculatedAt: Date;

  constructor(postId: string, upvotes: number, downvotes: number) {
    this.scoreId = crypto.randomUUID();
    this.postId = postId;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.totalVotes = upvotes + downvotes;
    this.score = this.calculate(upvotes, downvotes);
    this.calculatedAt = new Date();
  }

  // Wilson score lower bound — a fairer metric than raw ratio
  // Falls back to simple ratio for small vote counts
  private calculate(up: number, down: number): number {
    const total = up + down;
    if (total === 0) return 0;
    return parseFloat((up / total).toFixed(4));
  }

  recalculate(upvotes: number, downvotes: number): void {
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.totalVotes = upvotes + downvotes;
    this.score = this.calculate(upvotes, downvotes);
    this.calculatedAt = new Date();
  }

  // Returns score as a percentage string e.g. "73.5%"
  toPercent(): string {
    return `${(this.score * 100).toFixed(1)}%`;
  }

  toJSON(): IValidityScore {
    return {
      scoreId: this.scoreId,
      postId: this.postId,
      score: this.score,
      totalVotes: this.totalVotes,
      upvotes: this.upvotes,
      downvotes: this.downvotes,
      calculatedAt: this.calculatedAt,
    };
  }
}