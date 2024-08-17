import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { number: '9999999999' },
    update: {},
    create: {
      number: '9999999999',
      email: 'ketan9@gmail.com',
      password: 'ketan',
      name: 'ketan9',
    },
  })
  const bob = await prisma.user.upsert({
    where: { number: '8888888888' },
    update: {},
    create: {
      number: '8888888888',
      password: 'ketan',
      name: 'ketan8',
      email: 'ketan8@gmail.com',
    },
  })
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })