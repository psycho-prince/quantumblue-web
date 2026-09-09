const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const rawKey = 'qb_test_' + crypto.randomBytes(32).toString('hex');
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  await prisma.organization.upsert({
    where: { id: "test_org" },
    update: {},
    create: { id: "test_org", name: "Test Org" }
  });

  await prisma.apiKey.create({
    data: {
      organizationId: "test_org",
      keyHash,
      label: "Test Key",
    },
  });

  console.log(rawKey);
}

main().catch(console.error).finally(() => prisma.$disconnect());
