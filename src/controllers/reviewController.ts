import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  constructor(private reviewService: ReviewService = new ReviewService()) {}

  private handleError(res: Response, error: unknown): Response {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('VALIDATION_ERROR:')) return res.status(400).json({ status: 'fail', message: msg.split(':')[1] });
    if (msg.startsWith('NOT_FOUND:')) return res.status(404).json({ status: 'fail', message: msg.split(':')[1] });
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: msg });
  }

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stallId = req.query.stall_id ? Number(req.query.stall_id) : undefined;
      const reviews = await this.reviewService.getAll(stallId);
      return res.status(200).json({ status: 'success', message: 'Daftar review berhasil diambil (join user)', data: reviews });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const review = await this.reviewService.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Review berhasil dibuat', data: review });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const review = await this.reviewService.delete(Number(req.params.id));
      return res.status(200).json({ status: 'success', message: 'Review berhasil dihapus', data: review });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
