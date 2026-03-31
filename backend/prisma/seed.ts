import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ─────────────────────────────────────────
  // ROLES
  // ─────────────────────────────────────────

  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'SUPER_ADMIN' },
      update: {},
      create: { name: 'SUPER_ADMIN', description: 'Full platform access' },
    }),
    prisma.role.upsert({
      where: { name: 'VENDOR_ADMIN' },
      update: {},
      create: { name: 'VENDOR_ADMIN', description: 'Manages a specific store and its products' },
    }),
    prisma.role.upsert({
      where: { name: 'CUSTOMER' },
      update: {},
      create: { name: 'CUSTOMER', description: 'Default shopping user' },
    }),
  ]);

  console.log(`✅ Roles seeded: ${roles.map(r => r.name).join(', ')}`);

  // ─────────────────────────────────────────
  // SUPER_ADMIN USER
  // ─────────────────────────────────────────

  const superAdminRole = roles.find(r => r.name === 'SUPER_ADMIN');
  if (!superAdminRole) throw new Error('SUPER_ADMIN role not found after seeding');

  // bcrypt rounds=12 is the industry standard for balancing security and performance.
  const passwordHash = await bcrypt.hash('Admin@1234', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shahdcosmetics.com' },
    update: {},
    create: {
      email: 'admin@shahdcosmetics.com',
      passwordHash,
      isActive: true,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
        },
      },
      userRoles: {
        create: {
          roleId: superAdminRole.id,
        },
      },
    },
  });

  console.log(`✅ SUPER_ADMIN created: ${adminUser.email}`);

  // ─────────────────────────────────────────
  // CATEGORIES
  // ─────────────────────────────────────────

  const makeupCategory = await prisma.category.upsert({
    where: { slug: 'makeup' },
    update: {},
    create: { slug: 'makeup', name: 'Makeup', level: 1, sortOrder: 1 },
  });

  const skinCareCategory = await prisma.category.upsert({
    where: { slug: 'skin-care' },
    update: {},
    create: { slug: 'skin-care', name: 'Skin Care', level: 1, sortOrder: 2 },
  });

  const hairCareCategory = await prisma.category.upsert({
    where: { slug: 'hair-care' },
    update: {},
    create: { slug: 'hair-care', name: 'Hair Care', level: 1, sortOrder: 3 },
  });

  // Sub-categories
  const lipMakeupCategory = await prisma.category.upsert({
    where: { slug: 'lip-makeup' },
    update: {},
    create: {
      slug: 'lip-makeup',
      name: 'Lip Makeup',
      level: 2,
      sortOrder: 1,
      parentId: makeupCategory.id,
    },
  });

  const eyeMakeupCategory = await prisma.category.upsert({
    where: { slug: 'eye-makeup' },
    update: {},
    create: {
      slug: 'eye-makeup',
      name: 'Eye Makeup',
      level: 2,
      sortOrder: 2,
      parentId: makeupCategory.id,
    },
  });

  const moisturizerCategory = await prisma.category.upsert({
    where: { slug: 'moisturizer' },
    update: {},
    create: {
      slug: 'moisturizer',
      name: 'Moisturizer',
      level: 2,
      sortOrder: 1,
      parentId: skinCareCategory.id,
    },
  });

  console.log('✅ Categories seeded');

  // ─────────────────────────────────────────
  // ATTRIBUTE GROUPS & VALUES
  // ─────────────────────────────────────────

  const skinTypeGroup = await prisma.attributeGroup.upsert({
    where: { id: 'skin-type-group' },
    update: {},
    create: {
      id: 'skin-type-group',
      name: 'Skin Type',
      slug: 'skin-type',
      isFilterable: true,
    },
  });

  const skinToneGroup = await prisma.attributeGroup.upsert({
    where: { id: 'skin-tone-group' },
    update: {},
    create: {
      id: 'skin-tone-group',
      name: 'Skin Tone',
      slug: 'skin-tone',
      isFilterable: true,
    },
  });

  const finishGroup = await prisma.attributeGroup.upsert({
    where: { id: 'finish-group' },
    update: {},
    create: {
      id: 'finish-group',
      name: 'Finish',
      slug: 'finish',
      isFilterable: true,
    },
  });

  const coverageGroup = await prisma.attributeGroup.upsert({
    where: { id: 'coverage-group' },
    update: {},
    create: {
      id: 'coverage-group',
      name: 'Coverage',
      slug: 'coverage',
      isFilterable: true,
    },
  });

  // Attribute values
  await Promise.all([
    // Skin Type values
    prisma.attributeValue.upsert({ where: { id: 'dry' },         update: {}, create: { id: 'dry',         groupId: skinTypeGroup.id, value: 'Dry' } }),
    prisma.attributeValue.upsert({ where: { id: 'oily' },        update: {}, create: { id: 'oily',        groupId: skinTypeGroup.id, value: 'Oily' } }),
    prisma.attributeValue.upsert({ where: { id: 'combination' }, update: {}, create: { id: 'combination', groupId: skinTypeGroup.id, value: 'Combination' } }),
    prisma.attributeValue.upsert({ where: { id: 'sensitive' },   update: {}, create: { id: 'sensitive',   groupId: skinTypeGroup.id, value: 'Sensitive' } }),
    // Skin Tone values
    prisma.attributeValue.upsert({ where: { id: 'fair' },   update: {}, create: { id: 'fair',   groupId: skinToneGroup.id, value: 'Fair' } }),
    prisma.attributeValue.upsert({ where: { id: 'medium' }, update: {}, create: { id: 'medium', groupId: skinToneGroup.id, value: 'Medium' } }),
    prisma.attributeValue.upsert({ where: { id: 'dark' },   update: {}, create: { id: 'dark',   groupId: skinToneGroup.id, value: 'Dark' } }),
    // Finish values
    prisma.attributeValue.upsert({ where: { id: 'matte' },  update: {}, create: { id: 'matte',  groupId: finishGroup.id, value: 'Matte' } }),
    prisma.attributeValue.upsert({ where: { id: 'glossy' }, update: {}, create: { id: 'glossy', groupId: finishGroup.id, value: 'Glossy' } }),
    prisma.attributeValue.upsert({ where: { id: 'satin' },  update: {}, create: { id: 'satin',  groupId: finishGroup.id, value: 'Satin' } }),
    // Coverage values
    prisma.attributeValue.upsert({ where: { id: 'light' },  update: {}, create: { id: 'light',  groupId: coverageGroup.id, value: 'Light' } }),
    prisma.attributeValue.upsert({ where: { id: 'medium-coverage' }, update: {}, create: { id: 'medium-coverage', groupId: coverageGroup.id, value: 'Medium' } }),
    prisma.attributeValue.upsert({ where: { id: 'full' },   update: {}, create: { id: 'full',   groupId: coverageGroup.id, value: 'Full' } }),
  ]);

  console.log('✅ Attribute groups and values seeded');

  // ─────────────────────────────────────────
  // BRAND
  // ─────────────────────────────────────────

  const testBrand = await prisma.brand.upsert({
    where: { slug: 'test-brand' },
    update: {},
    create: {
      ownerUserId: adminUser.id,
      slug: 'test-brand',
      name: 'Test Brand',
      description: 'A test brand for development purposes',
      isVerified: true,
      isActive: true,
    },
  });

  console.log(`✅ Brand seeded: ${testBrand.name}`);

  // ─────────────────────────────────────────
  // PRODUCTS
  // ─────────────────────────────────────────

  const products = [
    {
      slug: 'matte-lipstick-red',
      name: 'Matte Lipstick - Red',
      description: 'Long-lasting matte lipstick in classic red.',
      basePrice: 129.99,
      categoryId: lipMakeupCategory.id,
      sku: 'LIP-MAT-RED-001',
      shadeName: 'Classic Red',
      shadeHex: '#C0392B',
    },
    {
      slug: 'matte-lipstick-nude',
      name: 'Matte Lipstick - Nude',
      description: 'Long-lasting matte lipstick in natural nude.',
      basePrice: 129.99,
      categoryId: lipMakeupCategory.id,
      sku: 'LIP-MAT-NUD-001',
      shadeName: 'Natural Nude',
      shadeHex: '#C68642',
    },
    {
      slug: 'volumizing-mascara',
      name: 'Volumizing Mascara',
      description: 'Adds intense volume and length to lashes.',
      basePrice: 149.99,
      categoryId: eyeMakeupCategory.id,
      sku: 'EYE-MAS-VOL-001',
      shadeName: null,
      shadeHex: null,
    },
    {
      slug: 'daily-moisturizer-spf30',
      name: 'Daily Moisturizer SPF30',
      description: 'Lightweight daily moisturizer with SPF30 sun protection.',
      basePrice: 249.99,
      categoryId: moisturizerCategory.id,
      sku: 'SKN-MOI-SPF-001',
      shadeName: null,
      shadeHex: null,
    },
    {
      slug: 'hydrating-hair-mask',
      name: 'Hydrating Hair Mask',
      description: 'Deep conditioning mask for dry and damaged hair.',
      basePrice: 189.99,
      categoryId: hairCareCategory.id,
      sku: 'HAI-MAS-HYD-001',
      shadeName: null,
      shadeHex: null,
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        brandId: testBrand.id,
        categoryId: p.categoryId,
        slug: p.slug,
        name: p.name,
        description: p.description,
        basePrice: p.basePrice,
        currency: 'TRY',
        isActive: true,
        variants: {
          create: {
            sku: p.sku,
            shadeName: p.shadeName,
            shadeHex: p.shadeHex,
            isActive: true,
            inventory: {
              create: {
                quantity: 100,
                reservedQty: 0,
                lowStockThreshold: 5,
              },
            },
          },
        },
      },
    });

    console.log(`✅ Product seeded: ${product.name}`);
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });