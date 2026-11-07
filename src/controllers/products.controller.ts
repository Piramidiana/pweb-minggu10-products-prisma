import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function getProducts(req: Request, res: Response) {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  res.status(200).json(products);
}