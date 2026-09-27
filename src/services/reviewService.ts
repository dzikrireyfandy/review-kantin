import { ReviewRepository, type ReviewInput } from '../repositories/reviewRepository.ts';

export class ReviewService {
  constructor(private reviewRepository: ReviewRepository = new ReviewRepository()) {}

  async getAll(stallId?: number) {
    return this.reviewRepository.findAll(stallId);
  }

  async create(input: ReviewInput) {
    if (!input.stallId || !input.userId || !input.rating) {
      throw new Error('VALIDATION_ERROR:stallId, userId, dan rating wajib diisi');
    }
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('VALIDATION_ERROR:rating harus antara 1 sampai 5');
    }
    return this.reviewRepository.create(input);
  }

  async delete(id: number) {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new Error('NOT_FOUND:Review tidak ditemukan');
    return this.reviewRepository.remove(id, review.stallId);
  }
}
