import { PrismaClient, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 0. Clear existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.review.deleteMany({});
    await prisma.image.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.wishlist.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.color.deleteMany({});
    await prisma.size.deleteMany({});
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@uzum.uz' },
        update: {},
        create: {
            email: 'admin@uzum.uz',
            phone: '+998901234567',
            password: hashedPassword,
            fullName: 'Admin User',
            role: 'ADMIN',
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
        },
    });
    console.log('✅ Admin created');

    // 2. Create Categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'elektronika' },
            update: {},
            create: {
                name: 'Elektronika',
                slug: 'elektronika',
                icon: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'kiyim' },
            update: {},
            create: {
                name: 'Kiyim',
                slug: 'kiyim',
                icon: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'uy-texnika' },
            update: {},
            create: {
                name: 'Uy texnikasi',
                slug: 'uy-texnika',
                icon: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'sport' },
            update: {},
            create: {
                name: 'Sport',
                slug: 'sport',
                icon: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'kitoblar' },
            update: {},
            create: {
                name: 'Kitoblar',
                slug: 'kitoblar',
                icon: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'gozallik' },
            update: {},
            create: {
                name: 'Go\'zallik',
                slug: 'gozallik',
                icon: 'https://images.unsplash.com/photo-1596462502278-27bfaf433394?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'salomatlik' },
            update: {},
            create: {
                name: 'Salomatlik',
                slug: 'salomatlik',
                icon: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'uy-rozgor' },
            update: {},
            create: {
                name: 'Uy-ro\'zg\'or',
                slug: 'uy-rozgor',
                icon: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'poyabzallar' },
            update: {},
            create: {
                name: 'Poyabzallar',
                slug: 'poyabzallar',
                icon: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'aksessuarlar' },
            update: {},
            create: {
                name: 'Aksessuarlar',
                slug: 'aksessuarlar',
                icon: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'bolalar' },
            update: {},
            create: {
                name: 'Bolalar tovarlari',
                slug: 'bolalar',
                icon: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'qurilish' },
            update: {},
            create: {
                name: 'Qurilish va ta\'mirlash',
                slug: 'qurilish',
                icon: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'avto' },
            update: {},
            create: {
                name: 'Avtotovarlar',
                slug: 'avto',
                icon: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200',
            },
        }),
    ]);
    console.log('✅ Categories created');

    // 3. Create Colors
    const colors = await Promise.all([
        prisma.color.upsert({
            where: { name: 'Qora' },
            update: {},
            create: { name: 'Qora', hexCode: '#000000' },
        }),
        prisma.color.upsert({
            where: { name: 'Oq' },
            update: {},
            create: { name: 'Oq', hexCode: '#FFFFFF' },
        }),
        prisma.color.upsert({
            where: { name: 'Qizil' },
            update: {},
            create: { name: 'Qizil', hexCode: '#FF0000' },
        }),
        prisma.color.upsert({
            where: { name: 'Ko\'k' },
            update: {},
            create: { name: 'Ko\'k', hexCode: '#0000FF' },
        }),
        prisma.color.upsert({
            where: { name: 'Yashil' },
            update: {},
            create: { name: 'Yashil', hexCode: '#00FF00' },
        }),
    ]);
    console.log('✅ Colors created');

    // 4. Create Sizes
    const sizes = await Promise.all([
        prisma.size.upsert({
            where: { name: 'S' },
            update: {},
            create: { name: 'S' },
        }),
        prisma.size.upsert({
            where: { name: 'M' },
            update: {},
            create: { name: 'M' },
        }),
        prisma.size.upsert({
            where: { name: 'L' },
            update: {},
            create: { name: 'L' },
        }),
        prisma.size.upsert({
            where: { name: 'XL' },
            update: {},
            create: { name: 'XL' },
        }),
        prisma.size.upsert({
            where: { name: 'XXL' },
            update: {},
            create: { name: 'XXL' },
        }),
    ]);
    console.log('✅ Sizes created');

    // 5. Create Products with Variants and Images
    const productsData = [
        // Elektronika
        {
            name: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            description: 'Eng so\'nggi iPhone modeli. A17 Pro chip, titanium korpus, professional kamera tizimi.',
            brand: 'Apple',
            categoryId: categories[0].id,
            rating: 4.8,
            variants: [
                {
                    colorId: colors[0].id,
                    sizeId: null,
                    sku: 'IP15P-BLK-256',
                    price: 14999000,
                    discount: 13999000,
                    stock: 50,
                    images: [
                        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
                        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
                    ],
                },
                {
                    colorId: colors[1].id,
                    sizeId: null,
                    sku: 'IP15P-WHT-256',
                    price: 14999000,
                    stock: 30,
                    images: [
                        'https://images.unsplash.com/photo-1592286927505-b0e2e279d8fd?w=800',
                    ],
                },
            ],
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            slug: 'samsung-s24-ultra',
            description: 'Eng kuchli Android smartfon. S Pen, 200MP kamera, AI funksiyalari.',
            brand: 'Samsung',
            categoryId: categories[0].id,
            rating: 4.7,
            variants: [
                {
                    colorId: colors[0].id,
                    sizeId: null,
                    sku: 'S24U-BLK-512',
                    price: 13999000,
                    discount: 12999000,
                    stock: 40,
                    images: [
                        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
                    ],
                },
            ],
        },
        {
            name: 'MacBook Air M3',
            slug: 'macbook-air-m3',
            description: 'Eng yengil va kuchli noutbuk. M3 chip, 18 soat batareya, Retina displey.',
            brand: 'Apple',
            categoryId: categories[0].id,
            rating: 4.9,
            variants: [
                {
                    colorId: colors[1].id,
                    sizeId: null,
                    sku: 'MBA-M3-SLV-256',
                    price: 16999000,
                    stock: 25,
                    images: [
                        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
                    ],
                },
            ],
        },

        // Kiyim
        {
            name: 'Nike Air Max 270',
            slug: 'nike-air-max-270',
            description: 'Zamonaviy sport poyabzal. Yuqori sifatli materiallar, qulay dizayn.',
            brand: 'Nike',
            categoryId: categories[1].id,
            rating: 4.6,
            variants: [
                {
                    colorId: colors[0].id,
                    sizeId: sizes[2].id,
                    sku: 'NIKE-AM270-BLK-L',
                    price: 899000,
                    discount: 799000,
                    stock: 100,
                    images: [
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
                    ],
                },
                {
                    colorId: colors[1].id,
                    sizeId: sizes[2].id,
                    sku: 'NIKE-AM270-WHT-L',
                    price: 899000,
                    stock: 80,
                    images: [
                        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
                    ],
                },
            ],
        },
        {
            name: 'Adidas Ultraboost',
            slug: 'adidas-ultraboost',
            description: 'Professional yugurish poyabzali. Boost texnologiyasi, yuqori qulaylik.',
            brand: 'Adidas',
            categoryId: categories[1].id,
            rating: 4.7,
            variants: [
                {
                    colorId: colors[0].id,
                    sizeId: sizes[1].id,
                    sku: 'ADIDAS-UB-BLK-M',
                    price: 1099000,
                    stock: 60,
                    images: [
                        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
                    ],
                },
            ],
        },

        // Uy texnikasi
        {
            name: 'Dyson V15 Detect',
            slug: 'dyson-v15-detect',
            description: 'Eng kuchli simsiz changyutgich. Lazer texnologiyasi, 60 daqiqa ishlash vaqti.',
            brand: 'Dyson',
            categoryId: categories[2].id,
            rating: 4.8,
            variants: [
                {
                    colorId: colors[4].id,
                    sizeId: null,
                    sku: 'DYSON-V15-GRN',
                    price: 5999000,
                    discount: 5499000,
                    stock: 15,
                    images: [
                        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
                    ],
                },
            ],
        },
        {
            name: 'Samsung Muzlatgich',
            slug: 'samsung-fridge-rt50',
            description: 'Zamonaviy muzlatgich. No Frost texnologiyasi, energiya tejamkor.',
            brand: 'Samsung',
            categoryId: categories[2].id,
            rating: 4.5,
            variants: [
                {
                    colorId: colors[1].id,
                    sizeId: null,
                    sku: 'SAMSUNG-FRG-WHT',
                    price: 7999000,
                    stock: 20,
                    images: [
                        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800',
                    ],
                },
            ],
        },

        // Sport
        {
            name: 'Yoga Mat Premium',
            slug: 'yoga-mat-premium',
            description: 'Professional yoga gilami. Ekologik materiallar, sirpanmaydigan sirt.',
            brand: 'YogaPro',
            categoryId: categories[3].id,
            rating: 4.4,
            variants: [
                {
                    colorId: colors[3].id,
                    sizeId: null,
                    sku: 'YOGA-MAT-BLU',
                    price: 299000,
                    discount: 249000,
                    stock: 150,
                    images: [
                        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
                    ],
                },
            ],
        },
        {
            name: 'Dumbbell Set 20kg',
            slug: 'dumbbell-set-20kg',
            description: 'Professional gantelllar to\'plami. Regulyatsiya qilinadigan og\'irlik.',
            brand: 'FitPro',
            categoryId: categories[3].id,
            rating: 4.6,
            variants: [
                {
                    colorId: colors[0].id,
                    sizeId: null,
                    sku: 'DUMBBELL-20KG',
                    price: 599000,
                    stock: 50,
                    images: [
                        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
                    ],
                },
            ],
        },

        // Kitoblar
        {
            name: 'Atomic Habits',
            slug: 'atomic-habits',
            description: 'James Clear tomonidan yozilgan bestseller. Kichik odatlar, katta natijalar.',
            brand: 'Penguin',
            categoryId: categories[4].id,
            rating: 4.9,
            variants: [
                {
                    colorId: null,
                    sizeId: null,
                    sku: 'BOOK-ATOMIC-HABITS',
                    price: 89000,
                    discount: 69000,
                    stock: 200,
                    images: [
                        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
                    ],
                },
            ],
        },
        {
            name: 'Rich Dad Poor Dad',
            slug: 'rich-dad-poor-dad',
            description: 'Robert Kiyosaki ning mashhur kitobi. Moliyaviy savodxonlik haqida.',
            brand: 'Warner Books',
            categoryId: categories[4].id,
            rating: 4.7,
            variants: [
                {
                    colorId: null,
                    sizeId: null,
                    sku: 'BOOK-RDPD',
                    price: 79000,
                    stock: 150,
                    images: [
                        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',
                    ],
                },
            ],
        },
        // Go'zallik
        {
            name: 'Atir Dior Sauvage',
            slug: 'dior-sauvage',
            description: 'Erkaklar uchun mashhur atir. Uzoq muddatli va yoqimli hid.',
            brand: 'Dior',
            categoryId: categories[5].id, // Go'zallik
            rating: 4.9,
            variants: [
                {
                    colorId: null,
                    sizeId: null,
                    sku: 'DIOR-SAUVAGE-100ML',
                    price: 1200000,
                    discount: 990000,
                    stock: 20,
                    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800'],
                },
            ],
        },
        // Salomatlik
        {
            name: 'Vitamin Complex Premium',
            slug: 'vitamin-complex',
            description: 'Organizm uchun zarur vitamiinlar to\'plami. Immunitetni mustahkamlaydi.',
            brand: 'HealthLife',
            categoryId: categories[6].id, // Salomatlik
            rating: 4.7,
            variants: [
                {
                    colorId: null,
                    sizeId: null,
                    sku: 'VITAMIN-PREM-60',
                    price: 250000,
                    stock: 100,
                    images: ['https://images.unsplash.com/photo-1584017945516-fa47c59bb7fe?w=800'],
                },
            ],
        },
        // Uy-ro'zg'or
        {
            name: 'Suyuq tozalash vositasi',
            slug: 'washing-liquid',
            description: 'Barcha yuzalar uchun universal tozalash vositasi. 1 litr.',
            brand: 'CleanHome',
            categoryId: categories[7].id, // Uy-ro'zg'or
            rating: 4.4,
            variants: [
                {
                    colorId: null,
                    sizeId: null,
                    sku: 'CLEAN-VOST-1L',
                    price: 45000,
                    discount: 35000,
                    stock: 300,
                    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'],
                },
            ],
        },
        // Poyabzallar
        {
            name: 'Klassik erkaklar poyabzali',
            slug: 'classic-shoes-men',
            description: 'Tabiiy charmdan tikilgan klassik poyabzal. Ofis va tadbirlar uchun.',
            brand: 'Derbi',
            categoryId: categories[8].id, // Poyabzallar
            rating: 4.8,
            variants: [
                {
                    colorId: colors[0].id, // Qora
                    sizeId: sizes[2].id, // L (placeholder for 42)
                    sku: 'SHOE-CLASS-BLK-42',
                    price: 650000,
                    discount: 550000,
                    stock: 15,
                    images: ['https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800'],
                },
            ],
        },
        // Aksessuarlar
        {
            name: 'Erkaklar qo\'l soati',
            slug: 'mens-watch-luxe',
            description: 'Elegant va zamonaviy qo\'l soati. Kvarsli mexanizm, charmdan tasma.',
            brand: 'Curren',
            categoryId: categories[9].id, // Aksessuarlar
            rating: 4.6,
            variants: [
                {
                    colorId: colors[0].id,
                    sizeId: null,
                    sku: 'WATCH-CURR-BLK',
                    price: 450000,
                    stock: 25,
                    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
                },
            ],
        },
        // Bolalar
        {
            name: 'Lego kover-konstruktor',
            slug: 'lego-set-city',
            description: 'Bolalar uchun qiziqarli konstruktor. Ijodiy fikrlashni rivojlantiradi.',
            brand: 'LEGO',
            categoryId: categories[10].id, // Bolalar
            rating: 5.0,
            variants: [
                {
                    colorId: null,
                    sizeId: null,
                    sku: 'LEGO-CITY-123',
                    price: 350000,
                    discount: 299000,
                    stock: 40,
                    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'],
                },
            ],
        },
        // Qurilish
        {
            name: 'Akumulyatorli drel',
            slug: 'cordless-drill',
            description: 'Uy va professional foydalanish uchun kuchli drel. 2 ta akkumulyator bilan.',
            brand: 'Makita',
            categoryId: categories[11].id, // Qurilish
            rating: 4.7,
            variants: [
                {
                    colorId: null,
                    sizeId: null,
                    sku: 'DRILL-MAK-18V',
                    price: 1200000,
                    stock: 10,
                    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800'],
                },
            ],
        },
        // Avto
        {
            name: 'Avtomobil videoregistratori',
            slug: 'car-dashcam-4k',
            description: '4K sifatda video oluvchi registrator. Kechki ko\'rish funksiyasi bilan.',
            brand: 'Xiaomi',
            categoryId: categories[12].id, // Avto
            rating: 4.5,
            variants: [
                {
                    colorId: colors[0].id,
                    sizeId: null,
                    sku: 'DASH-CAM-4K',
                    price: 850000,
                    discount: 750000,
                    stock: 30,
                    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
                },
            ],
        },
    ];

    for (const productData of productsData) {
        const { variants, ...productInfo } = productData;

        const product = await prisma.product.upsert({
            where: { slug: productInfo.slug },
            update: {},
            create: {
                ...productInfo,
                sellerId: admin.id,
                status: ProductStatus.ACTIVE,
            },
        });

        for (const variantData of variants) {
            const { images, ...variantInfo } = variantData;

            const variant = await prisma.productVariant.upsert({
                where: { sku: variantInfo.sku },
                update: {},
                create: {
                    ...variantInfo,
                    productId: product.id,
                    isActive: true,
                },
            });

            // Create images
            for (let i = 0; i < images.length; i++) {
                await prisma.image.create({
                    data: {
                        url: images[i],
                        productVariantId: variant.id,
                        isMain: i === 0,
                    },
                });
            }
        }

        console.log(`✅ Product created: ${product.name}`);
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
