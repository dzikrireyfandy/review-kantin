import { StallRepository, type FindAllStallParams, type StallInput } from '../repositories/stallRepository.ts';
import type { StallResponseDto } from '../dtos/stallDto.ts';

type StallRow = NonNullable<Awaited<ReturnType<StallRepository['findById']>>>;

export class StallService {
  constructor(private stallRepository: StallRepository = new StallRepository()) {}

  // Mapping row DB -> DTO API (sekaligus logika bisnis isPopular)
  private toDto(row: StallRow): StallResponseDto {
    const avgRating = Number(row.avgRating);
    return {
      id: row.id,
      ownerId: row.ownerId,
      name: row.name,
      category: row.category,
      location: row.location,
      description: row.description,
      avgRating,
      reviewCount: row.reviewCount,
      isPopular: avgRating >= 4.7,
    };
  }

  async getAllStalls(params: FindAllStallParams) {
    const { rows, total } = await this.stallRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getStallById(id: number): Promise<StallResponseDto> {
    const row = await this.stallRepository.findById(id);
    if (!row) throw new Error('NOT_FOUND:Warung tidak ditemukan');
    return this.toDto(row);
  }

  private validate(input: Partial<StallInput>) {
    if (!input.ownerId || !input.name) {
      throw new Error('VALIDATION_ERROR:ownerId dan name wajib diisi');
    }
  }

  async createStall(input: StallInput): Promise<StallResponseDto> {
    this.validate(input);
    const row = await this.stallRepository.create(input);
    return this.toDto(row);
  }

  async updateStall(id: number, input: StallInput): Promise<StallResponseDto> {
    this.validate(input);
    await this.getStallById(id); // mastiin ada dulu -> 404 kalau nggak ada
    const row = await this.stallRepository.update(id, input);
    return this.toDto(row);
  }

  async deleteStall(id: number): Promise<StallResponseDto> {
    await this.getStallById(id);
    const row = await this.stallRepository.remove(id);
    return this.toDto(row);
  }
}
