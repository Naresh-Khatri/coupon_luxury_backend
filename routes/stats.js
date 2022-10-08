import express from "express";
import { checkIfAuthenticated } from "../middlewares/auth-middleware.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Router = express.Router();

Router.get("/", checkIfAuthenticated, async (req, res) => {
  const storesCount = await prisma.store.count();
  const categoriesCount = await prisma.category.count();
  const dealsCount = await prisma.offer.count({
    where: { active: true, offerType: "deal" },
  });
  const couponsCount = await prisma.offer.count({
    where: { active: true, offerType: "coupon" },
  });

  res.json({
    storesCount,
    categoriesCount,
    dealsCount,
    couponsCount,
  });
});

export default Router;
