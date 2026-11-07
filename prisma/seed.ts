import { prisma } from '../src/lib/prisma.js';

const total = await prisma.product.count();

if (total === 0) {
  await prisma.product.createMany({
    data: [
      { name: 'Buku', price: 15000 },
      { name: 'Pulpen', price: 5000 },
      { name: 'Spidol', price: 8000 },
    ],
  });
  console.log('Seed selesai: 3 produk ditambahkan');
} else {
  console.log(`Seed dilewati: tabel Product sudah berisi ${total} data`);
}

await prisma.$disconnect();