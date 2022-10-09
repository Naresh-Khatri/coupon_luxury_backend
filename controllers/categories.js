import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

import serializer from "../utils/serializer.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPublicCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        active: true,
      },
      include: {
        offers: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        subCategories: {
          select: {
            id: true,
            subCategoryName: true,
            slug: true,
          },
        },
      },

      orderBy: {
        categoryName: "asc",
      },
    });
    res.send(categories);

    // const allCategories = await categoryModel
    //   .find({ active: true })
    // .sort({ categoryName: 1 });

    // res.send(allCategories);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllCategories(req, res) {
  try {
    const allCategories = await prisma.category.findMany({
      orderBy: {
        categoryName: "asc",
      },
    });

    // const allCategories = await categoryModel.find().sort({ categoryName: 1 });

    res.send(allCategories);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

export async function getCategory(req, res) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(req.params.categoryId),
      },
    });
    res.send(category);
    // const category = await categoryModel
    //   .findById(req.params.categoryId)
    //   .sort({ categoryName: -1 });
    // res.send(category);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Category not found" });
  }
}
export async function getCategoryWithName(req, res) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        //regex is case insensitive
        categoryName: {
          contains: req.params.categoryName,
          mode: "insensitive",
        },
      },
    });
    res.send(category);

    // const category = await categoryModel
    //   .findOne({
    //     categoryName: { $regex: req.params.categoryName, $options: "i" },
    //   })
    //   .sort({ categoryName: -1 });
    // res.send(category);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Category not found" });
  }
}
export async function getCategoryWithSlug(req, res) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug: req.params.categorySlug,
      },
      include: {
        offers: {
          where: {
            active: true,
          },
          include: {
            store: {
              select: {
                storeName: true,
                image: true,
                slug: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });
    res.send(category);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Category not found" });
  }
}

export async function createCategory(req, res) {
  try {
    const categoryExists = await prisma.category.findUnique({
      where: {
        slug: req.body.slug,
      },
    });
    if (categoryExists)
      return res.status(409).json({ message: "Category already exists" });

    const result = await imageKit.upload({
      file: req.files.image.data,
      fileName: req.body.slug,
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });

    const data = serializer({
      ...req.body,
      uid: req.user.uid,
      image: result.url,
    });
    const newCategory = await prisma.category.create({
      data,
    });
    res.status(200).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "slug already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}

export async function updateCategory(req, res) {
  try {
    // console.log(req.params.categoryId, req.body, req.files);
    //check if image is provided
    if (req.files && req.files.image) {
      //upload buffer to imageKit
      const result = await imageKit.upload({
        file: req.files.image.data,
        fileName: req.body.slug,
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      });
      const oldImage = await prisma.category.findUnique({
        where: {
          id: parseInt(req.params.categoryId),
        },
        select: {
          image: true,
        },
      });
      const data = serializer({
        ...req.body,
        image: result.url,
      });
      const updatedCategory = await prisma.category.update({
        where: {
          id: parseInt(req.params.categoryId),
        },
        data,
      });
      //now remove the old image from imageKit
      //grab the old image from the db
      const oldImageName =
        oldImage.image.split("/")[oldImage.image.split("/").length - 1];
      //remove the old image from imageKit
      removeImgFromImageKit(oldImageName);
      res.json(updatedCategory);
    } else {
      const data = serializer(req.body);
      const updatedCategory = await prisma.category.update({
        where: {
          id: parseInt(req.params.categoryId),
        },
        data,
      });
      res.json(updatedCategory);
    }
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "slug already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}
export async function getAutoCompleteData(req, res) {
  try {
    const { searchText } = req.body;
    //do a case insensitive search
    const categories = await prisma.category.findMany({
      where: {
        categoryName: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      select: {
        categoryName: true,
        slug: true,
      },
    });
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid Request" });
  }
}
export async function getSubCategories(req, res) {
  try {
    const subCategories = await prisma.subCategory.findMany({
      where: {
        categoryId: parseInt(req.params.categoryId),
      },
      orderBy: {
        subCategoryName: "asc",
      },
    });
    res.send(subCategories);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid Request" });
  }
}

export async function deleteCategory(req, res) {
  try {
    console.log("delete category", req.params.categoryId);
    const deletedCategory = await prisma.category.delete({
      where: {
        id: parseInt(req.params.categoryId),
      },
    });
    res.json(deletedCategory);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid Request" });
  }
}
