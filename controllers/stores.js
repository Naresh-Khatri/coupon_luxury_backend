import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import serializer from "../utils/serializer.js";

export async function createStore(req, res) {
  try {
    console.log(req.body);
    //check if title already exists
    const storeExists = await prisma.store.findUnique({
      where: {
        slug: req.body.slug,
      },
    });
    if (storeExists) return res.status(409).send("store already exists");

    //create new category
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
    console.log(result);
    //TODO: are category and subCategory required?
    const data = serializer({
      ...req.body,
      uid: req.user.uid,
      image: result.url,
    });
    const newStore = await prisma.store.create({ data });
    res.json(newStore);
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "slug already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}
export async function updateStore(req, res) {
  try {
    // console.log(req.params.storeId, req.body, req.files);
    // console.log('\n\n\n\n\n\n Heli')
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
      //TODO: check if double fetch is required
      const oldStore = await prisma.store.findUnique({
        where: {
          id: parseInt(req.params.storeId),
        },
      });
      const data = serializer({
        ...req.body,
        image: result.url,
      });
      const updatedStore = await prisma.store.update({
        where: {
          id: parseInt(req.params.storeId),
        },
        data,
      });
      //now remove the old image from imageKit
      //grab the old image from the db
      const oldImageName =
        oldStore.image.split("/")[oldStore.image.split("/").length - 1];
      //remove the old image from imageKit
      removeImgFromImageKit(oldImageName);
      res.json(updatedStore);
    } else {
      const data = serializer(req.body);
      const updatedStore = await prisma.store.update({
        where: {
          id: parseInt(req.params.storeId),
        },
        data,
      });
      res.json(updatedStore);
    }
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "slug already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}
export async function getStore(req, res) {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: parseInt(req.params.storeId),
      },
      include: {
        blogs: true,
        offers: {
          orderBy: {
            updatedAt: "desc",
          },
        },
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
    });
    res.send(store);
  } catch (err) {
    console.log(err);
  }
}
export async function getStoresWithName(req, res) {
  try {
    //do a case insensitive search
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        storeName: true,
        slug: true,
        image: true,
      },
      where: {
        storeName: {
          contains: req.params.storeName,
          mode: "insensitive",
        },
      },
      orderBy: {
        storeName: "asc",
      },
    });
    res.send(stores);
  } catch (err) {
    console.log(err);
  }
}
export async function getStoreWithSlug(req, res) {
  try {
    // console.log(req.params.storeSlug);
    // do a case insensitive search
    const store = await prisma.store.findFirst({
      where: {
        slug: {
          contains: req.params.storeSlug,
          mode: "insensitive",
        },
      },
      include: {
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
        offers: {
          where: {
            active: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });
    console.log(store)
    res.send(store);
  } catch (err) {
    console.log(err);
  }
}
export async function getAutoCompleteData(req, res) {
  try {
    const { searchText } = req.body;
    //do a case insensitive search
    const store = await prisma.store.findMany({
      where: {
        storeName: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        storeName: true,
        slug: true,
        image: true,
      },
      orderBy: {
        storeName: "asc",
      },
    });
    res.send(store);
  } catch (err) {
    console.log(err);
  }
}
export async function getAllStores(req, res) {
  try {
    const allStores = await prisma.store.findMany({
      include: {
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
      orderBy: {
        storeName: "asc",
      },
    });
    res.send(allStores);
  } catch (err) {
    console.log(err);
  }
}
export async function getPublicStores(req, res) {
  try {
    const query = { active: true };
    if (req.query.featured) query.featured = true;
    if (req.query.category) query.category = req.query.category;
    if (req.query.offerType) query.offerType = req.query.offerType;
    // if (req.query.limit) query.limit = req.query.limit;
    console.log(query);
    const stores = await prisma.store.findMany({
      where: query,
      take: parseInt(query.limit) || 50,
      select: {
        id: true,
        storeName: true,
        slug: true,
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
      orderBy: {
        storeName: "asc",
      },
    });
    res.send(stores);
  } catch (err) {
    console.log(err);
  }
}
export async function deleteStore(req, res) {
  //TODO: add a logic to remove stores image too
  try {
    console.log(req.body);
    const deletedStore = await prisma.store.delete({
      where: {
        id: parseInt(req.params.storeId),
      },
    });
    res.json(deletedStore);
  } catch (err) {
    console.log(err);
  }
}
