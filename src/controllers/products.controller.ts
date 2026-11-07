import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function parseId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isValidProduct(name: unknown, price: unknown) {
  return typeof name === 'string' && name.trim() !== '' && typeof price === 'number' && Number.isInteger(price) && price >= 0;
}

export async function getProducts(req: Request, res: Response) {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  res.status(200).json(products);
}

export async function getProductById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'id harus berupa angka bulat positif' });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.status(200).json(product);
}

export async function createProduct(req: Request, res: Response) {
  const { name, price } = req.body ?? {};

  if (!isValidProduct(name, price)) {
    return res.status(400).json({ message: 'name wajib berupa teks dan price wajib berupa angka bulat >= 0' });
  }

  const product = await prisma.product.create({
    data: { name: name.trim(), price },
  });

  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const { id, name, price } = req.body ?? {};

  const productId = parseId(id);
  if (!productId) {
    return res.status(400).json({ message: 'id wajib diisi dengan angka bulat positif' });
  }

  if (!isValidProduct(name, price)) {
    return res.status(400).json({ message: 'name wajib berupa teks dan price wajib berupa angka bulat >= 0' });
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: { name: name.trim(), price },
  });

  res.status(200).json(product);
}