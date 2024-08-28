const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const brands = ['aruba', 'fortinet', 'hp', 'huawei'];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { name: brand },
      update: {},
      create: { name: brand },
    });
  }

  console.log('Seeded predefined brands');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
