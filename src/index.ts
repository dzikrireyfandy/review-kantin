import express, { type Request, type Response, type Application, type NextFunction } from 'express';
import 'dotenv/config';
import { sql } from 'drizzle-orm';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger-output.json' with { type: 'json' };

import { getDb } from './db/index.ts';
import { userRouter } from './routes/userRouter.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { menuItemRouter } from './routes/menuItemRouter.ts';
import { reviewRouter } from './routes/reviewRouter.ts';
import { likeRouter } from './routes/likeRouter.ts';
import { flagRouter } from './routes/flagRouter.ts';
import { auditLogRouter } from './routes/auditLogRouter.ts';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());

// Dokumentasi API interaktif, buka di http://localhost:3000/docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check: memastikan server DAN database bisa dijangkau
app.get('/health', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.execute(sql`SELECT 1 AS ok`);
    res.status(200).json({ status: 'success', message: 'Server dan database terhubung' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal terhubung ke database',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Pendaftaran semua module router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/stalls', stallRouter);
app.use('/api/v1/menu-items', menuItemRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/flags', flagRouter);
app.use('/api/v1/audit-logs', auditLogRouter);

// 404 handler untuk endpoint yang tidak terdaftar
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'fail', message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan` });
});

// Global error handler cadangan
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Terjadi kesalahan tak terduga pada server' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Dokumentasi API: http://localhost:${PORT}/docs`);
});
