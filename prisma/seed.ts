import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const defaultCategories = [
    { name: "Wakaf", slug: "wakaf" },
    { name: "Donasi", slug: "donasi" },
    { name: "Bencana", slug: "bencana" },
];

const defaultMenuItems = [
    { label: "Hitung Zakat", icon: "Calculator", color: "bg-emerald-100 text-emerald-600", href: "/zakat", order: 1 },
    { label: "Wakaf Asrama", icon: "Tent", color: "bg-blue-100 text-blue-600", href: "/wakaf/asrama", order: 2 },
    { label: "Sedekah Subuh", icon: "HandHeart", color: "bg-rose-100 text-rose-600", href: "/sedekah-subuh", order: 3 },
    { label: "Jadwal Kajian", icon: "Calendar", color: "bg-amber-100 text-amber-600", href: "/jadwal-kajian", order: 4 },
    { label: "Al-Qur'an", icon: "BookOpen", color: "bg-violet-100 text-violet-600", href: "/quran", order: 5 },
    { label: "Info Majlis", icon: "Megaphone", color: "bg-cyan-100 text-cyan-600", href: "/berita", order: 6 },
    { label: "Tanya Ustadz", icon: "BookOpen", color: "bg-orange-100 text-orange-600", href: "#", order: 7 },
    { label: "Lainya", icon: "LayoutGrid", color: "bg-gray-100 text-gray-600", href: "#", order: 8 },
];

async function main() {
    console.log("Start seeding ...")

    // 1. Seed Admin User
    const password = await hash('admin123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'admin@zakatkita.com' },
        update: {},
        create: {
            email: 'admin@zakatkita.com',
            name: 'Super Admin',
            password,
            role: 'ADMIN',
        },
    })
    console.log({ user })

    // 2. Seed Menu Items
    for (const item of defaultMenuItems) {
        // Upsert to avoid duplicates if re-running without reset
        // Using label as unique identifier proxy since we don't have slug on all
        // Actually, we can check by label or just create if empty.
        // For 'reset' scenario, just createMany is better but upsert is safer.
        // Assuming clean DB, create is fine.
        // But to be safe let's findFirst or create.
        const exists = await prisma.menuItem.findFirst({ where: { label: item.label } });
        if (!exists) {
            await prisma.menuItem.create({ data: item });
        }
    }
    console.log("Menu Items seeded")

    // 3. Seed Categories
    for (const cat of defaultCategories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: { name: cat.name, slug: cat.slug }
        });
    }
    console.log("Categories seeded")

    // 4. Seed Default Settings
    const defaultSettings = [
        { key: "majlisName", value: "Zakat Kita" },
        { key: "majlisAddress", value: "Jl. Raya Bandung - Sumedang" },
        { key: "majlisPhone", value: "+62 812-3456-7890" },
        { key: "runningText_content", value: "Selamat Datang di Aplikasi Zakat Kita. Sucikan Harta, Bersihkan Jiwa. Salurkan Zakat, Infaq, dan Sedekah anda melalui kami." },
        { key: "runningText_speed", value: "20" },
        { key: "runningText_isActive", value: "true" },
        { key: "zakatWidgetActive", value: "true" },
        { key: "prayerWidgetActive", value: "true" },
        { key: "dailyWisdomActive", value: "true" },
        { key: "hadithWidgetActive", value: "true" },
    ];

    for (const setting of defaultSettings) {
        await prisma.settings.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: { key: setting.key, value: setting.value }
        });
    }
    console.log("Settings seeded")
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
