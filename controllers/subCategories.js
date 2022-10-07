import streamifier from "streamifier";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";

import serializer from "../utils/serializer.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPublicSubCategories(req, res) {
  try {
    const subCategories = await prisma.subCategory.findMany({
      where: {
        active: true,
      },
      include: {
        category: {
          select: {
            categoryName: true,
            slug: true,
          },
        },
      },
      orderBy: {
        subCategoryName: "asc",
      },
    });
    res.send(subCategories);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllSubCategories(req, res) {
  try {
    const allSubCategories = await prisma.subCategory.findMany({
      include: {
        category: {
          select: {
            categoryName: true,
            slug: true,
          },
        },
      },
      orderBy: {
        subCategoryName: "asc",
      },
    });
    res.send(allSubCategories);
  } catch (err) {
    console.log(err);
  }
}

export async function getSubCategory(req, res) {
  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: {
        id: parseInt(req.params.subCategoryId),
      },
      orderBy: {
        subCategoryName: "asc",
      },
    });
    res.send(subCategory);
  } catch (err) {
    console.log(err);
  }
}

export async function createSubCategory(req, res) {
  try {
    //create new subCategory

    const data = serializer({
      ...req.body,
      uid: req.user.uid,
    });
    const newSubCategory = await prisma.subCategory.create({ data });

    //save subCategory in the category relation
    await prisma.category.update({
      where: {
        id: parseInt(req.body.categoryId),
      },
      data: {
        subCategories: {
          connect: {
            id: newSubCategory.id,
          },
        },
      },
    });
    res.json(newSubCategory);
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(409).send("SubCategory already exists");
    else res.status(400).send("Invalid Request");
  }
}

export async function updateSubCategory(req, res) {
  try {
    //check if image is provided
    const data = serializer({
      ...req.body,
    });
    const updatedsubCategory = await prisma.subCategory.update({
      where: {
        id: parseInt(req.params.subCategoryId),
      },
      data,
    });
    res.json(updatedsubCategory);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid Request");
  }
}

export async function deleteSubCategory(req, res) {
  try {
    const deletedSubCategory = await prisma.subCategory.delete({
      where: {
        id: parseInt(req.params.subCategoryId),
      },
    });
    res.json(deletedSubCategory);
  } catch (err) {
    console.log(err);
  }
}
