import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';

export class StallController {
  constructor(private stallService: StallService = new StallService()) {}

  private handleError(res: Response, error: unknown): Response {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('VALIDATION_ERROR:')) {
      return res.status(400).json({ status: 'fail', message: msg.split(':')[1] });
    }
    if (msg.startsWith('NOT_FOUND:')) {
      return res.status(404).json({ status: 'fail', message: msg.split(':')[1] });
    }
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: msg });
  }

  getStalls = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const location = typeof req.query.location === 'string' ? req.query.location : undefined;

      const { data, total } = await this.stallService.getAllStalls({ search, category, location, page, limit });
      return res.status(200).json({
        status: 'success',
        message: 'Daftar warung berhasil diambil',
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getStallById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.getStallById(Number(req.params.id));
      return res.status(200).json({ status: 'success', message: 'Detail warung berhasil diambil', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.createStall(req.body);
      return res.status(201).json({ status: 'success', message: 'Warung berhasil dibuat', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  updateStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.updateStall(Number(req.params.id), req.body);
      return res.status(200).json({ status: 'success', message: 'Warung berhasil diupdate', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.deleteStall(Number(req.params.id));
      return res.status(200).json({ status: 'success', message: 'Warung berhasil dihapus', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
