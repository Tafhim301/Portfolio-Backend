import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { prisma } from "../../shared/prisma";



export async function seedAdmin() {
  const email = config.ADMIN_EMAIL;
  const password = config.ADMIN_PASSWORD;
  const saltRounds = Number(config.BCRYPT_SALT_ROUND) || 10;

  if (!email || !password) {
    console.error("❌ Admin email or password is missing in .env/config");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Tafhimul Islam",
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created successfully!");
  } else {
    console.log("Admin already exists");
  }
}

seedAdmin()
  .catch((e) => {
    console.error("❌ Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
