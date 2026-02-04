
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const phone = process.argv[2];

    if (!phone) {
        console.error('Iltimos, telefon raqamni kiriting. Masalan: npx ts-node scripts/make_admin.ts +998901234567');

        // List recent users to help
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { phone: true, role: true, fullName: true }
        });
        console.log('\nOxirgi foydalanuvchilar:');
        console.table(users);
        return;
    }

    const user = await prisma.user.findUnique({
        where: { phone },
    });

    if (!user) {
        console.error(`Foydalanuvchi topilmadi: ${phone}`);
        return;
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: Role.ADMIN },
    });

    console.log(`Muvaffaqiyatli! ${updated.fullName} (${updated.phone}) endi ${updated.role}.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
