import { avg, count, eq, sql } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users, stalls } from '../db/schema.ts';

export interface ReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string;
}

export class ReviewRepository {
  // JOIN ke USERS supaya response menampilkan nama reviewer (REVIEWS + JOIN user)
  async findAll(stallId?: number) {
    const db = await getDb();
    const base = db
      .select({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        userName: users.name,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id));

    if (stallId) {
      return base.where(eq(reviews.stallId, stallId));
    }
    return base;
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(reviews).where(eq(reviews.id, id));
    return rows[0];
  }

  async create(input: ReviewInput) {
    const db = await getDb();
    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment ?? null,
        likeCount: 0,
      });
    await this.recalculateStallRating(input.stallId);
    return rows[0];
  }

  async remove(id: number, stallId: number) {
    const db = await getDb();
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    await this.recalculateStallRating(stallId);
    return rows[0];
  }

  // Fitur tambahan: jaga avg_rating & review_count di STALLS tetap sinkron
  private async recalculateStallRating(stallId: number) {
    const db = await getDb();
    const agg = await db
      .select({ cnt: count(), avgRating: avg(reviews.rating) })
      .from(reviews)
      .where(eq(reviews.stallId, stallId));

    const cnt = Number(agg[0]?.cnt ?? 0);
    const avgRating = agg[0]?.avgRating ? Number(agg[0].avgRating).toFixed(2) : '0.00';

    await db
      .update(stalls)
      .set({ reviewCount: cnt, avgRating })
      .where(eq(stalls.id, stallId));
  }
}
