import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Router = express.Router();

Router.get("/", async (req, res) => {
  const promises = [
    prisma.store.findMany({
      where: { active: true, featured: true },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        storeName: true,
        slug: true,
        storeURL: true,
        image: true,

        category: {
          select: {
            id: true,
            categoryName: true,
            slug: true,
          },
        },
        subCategory: {
          select: {
            id: true,
            subCategoryName: true,
            slug: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      where: { active: true },
      select: {
        id: true,
        categoryName: true,
        slug: true,
        image: true,
        imgAlt: true,
        featured: true,
        offers: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { categoryName: "asc" },
    }),
    prisma.slide.findMany({
      where: { active: true },
      select: {
        id: true,
        title: true,
        imgURL: true,
        imgAlt: true,
        link: true,
        order: true,
      },
      orderBy: { order: "asc" },
    }),
    prisma.offer.findMany({
      where: { active: true, featured: true },
      select: {
        id: true,
        slug: true,
        title: true,
        URL: true,
        affURL: true,
        discountType: true,
        discountValue: true,
        couponCode: true,
        categoryId: true,
        store: {
          select: {
            id: true,
            image: true,
            storeName: true,
            slug: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ];
  const [featuredStores, categories, slides, featuredOffers] =
    await Promise.all(promises);
  res.send({ featuredStores, categories, slides, featuredOffers });
});

export default Router;
