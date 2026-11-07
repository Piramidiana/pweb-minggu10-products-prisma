import type { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan` });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }

  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}