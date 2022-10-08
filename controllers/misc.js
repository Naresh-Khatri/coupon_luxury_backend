import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getSitemap(req, res) {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
    },
    select: {
      image: true,
      categoryName: true,
      slug: true,
      subCategories: {
        select: {
          subCategoryName: true,
          slug: true,
        },
      },
      description: true,
    },
  });
  res.json(categories);
}
