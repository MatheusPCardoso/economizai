import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug(walletId: string) {
  console.log('walletId (input):', walletId)

  const count = await prisma.transaction.count({ where: { walletId } })
  console.log('Prisma count by walletId (string match):', count)

  const sample = await prisma.transaction.findMany({
    where: { walletId },
    take: 5,
    orderBy: { reference: 'desc' },
    select: {
      id: true,
      amount: true,
      reference: true,
      createdAt: true,
      walletId: true,
      categoryId: true,
    },
  })
  console.log('Sample docs (Prisma findMany):', sample)
  await prisma.$disconnect()
}

debug(process.argv[2]).catch((e) => {
  console.error(e)
  prisma.$disconnect()
})
