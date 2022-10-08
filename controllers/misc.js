import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getSitemap(req, res) {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
    },
    // select: {
    //   image: true,
    //   categoryName: true,
    //   slug: true,
    //   subCategories: true,
    //   description: true,
    // },
    include: {
      subCategories: {
        select: {
          subCategoryName: true,
          slug: true,
        },
      },
    },
  });
  res.json(categories);
}
