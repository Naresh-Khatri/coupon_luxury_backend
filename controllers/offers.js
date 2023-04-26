import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import serializer from "../utils/serializer.js";

export async function getAllOffers(req, res) {
  try {
    const allOffers = await prisma.offer.findMany({
      include: {
        store: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            storeURL: true,
            active: true,
            categoryId: true,
            subCategoryId: true,
            featured: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.send(allOffers);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Could find offers" });
  }
}

export async function getPublicOffers(req, res) {
  try {
    // console.log("public:", req.query);
    const query = { active: true };
    if (req.query.featured) query.featured = true;
    if (req.query.categoryId) query.categoryId = parseInt(req.query.categoryId);
    if (req.query.offerType) query.offerType = req.query.offerType;
    console.log(query);
    // if (req.query.limit) query.limit = req.query.limit;

    const allOffers = await prisma.offer.findMany({
      where: query,
      take: parseInt(req.query.limit) || 50,
      include: {
        store: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            storeURL: true,
            image: true,
            active: true,
            offers: { select: { id: true } },
            categoryId: true,
            subCategoryId: true,
            featured: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.send(allOffers);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

export async function getOffer(req, res) {
  try {
    //do a case insensitive search
    const offer = await prisma.offer.findUnique({
      where: {
        id: parseInt(req.params.offerId),
      },
      include: {
        store: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            storeURL: true,
            active: true,
            categoryId: true,
            subCategoryId: true,
            featured: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    res.send(offer);
  } catch (err) {
    console.log(err);
    res.status(404).json({ err: "offer not found" });
  }
}
export async function getOfferWithSlug(req, res) {
  try {
    const offer = await prisma.offer.findFirst({
      where: {
        slug: req.params.offerSlug.toLowerCase(),
      },
      include: {
        store: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            storeURL: true,
            image: true,
            active: true,
            categoryId: true,
            subCategoryId: true,
            featured: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    
    // console.log(offer)

    res.send(offer);
  } catch (err) {
    console.log(err);
    res.status(404).json({ err: "offer not found" });
  }
}

export async function getOffersWithTitle(req, res) {
  try {
    //do a case insensitive search
    const offers = await prisma.offer.findMany({
      where: {
        title: {
          contains: req.params.offerTitle,
          mode: "insensitive",
        },
      },
      include: {
        store: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            storeURL: true,
            image: true,
          },
        },
      },
    });
    // .populate("category", "categoryName categorySlug _id ")
    // .populate("subCategory", "subCategoryName subCategorySlug _id ")
    // .populate("offers");
    res.send(offers);
  } catch (err) {
    console.log(err);
    res.status(404).json({ err: "offer not found" });
  }
}

export async function createOffer(req, res) {
  try {
    //create new subCategory
    const data = serializer({ ...req.body, uid: req.user.uid });

    const newOffer = await prisma.offer.create({
      data,
    });
    //now save it in store, category and subCategory collections
    const store = await prisma.store.update({
      where: {
        id: parseInt(req.body.storeId),
      },
      data: {
        offers: {
          connect: {
            id: newOffer.id,
          },
        },
      },
    });
    console.log("saved in store", store.offers);
    const category = await prisma.category.update({
      where: {
        id: parseInt(req.body.categoryId),
      },
      data: {
        offers: {
          connect: {
            id: newOffer.id,
          },
        },
      },
    });
    console.log("saved in category", category.offers);
    const subCategory = await prisma.subCategory.update({
      where: {
        id: parseInt(req.body.subCategoryId),
      },
      data: {
        offers: {
          connect: {
            id: newOffer.id,
          },
        },
      },
    });
    console.log("saved in sub cat", subCategory.offers);

    res.json(newOffer);
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "slug already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}

export async function updateOffer(req, res) {
  try {
    // console.log(req.params.offerId, req.body);
    //update the offer info
    const data = serializer(req.body);
    const updatedOffer = await prisma.offer.update({
      where: {
        id: parseInt(req.params.offerId),
      },
      data,
    });
    //check if store, category or subCategory has changed
    //if yes, update the offer in the new store, category and subCategory collections
    if (
      req.body.storeId != updatedOffer.id ||
      req.body.categoryId != updatedOffer.categoryId ||
      req.body.subCategoryId != updatedOffer.subCategoryId
    ) {
      //now update the offer in store, category and subCategory tables
      const store = await prisma.store.update({
        where: {
          id: parseInt(req.body.storeId),
        },
        data: {
          offers: {
            connect: {
              id: updatedOffer.id,
            },
          },
        },
      });
      console.log("updated in store", store.offers);
      const category = await prisma.category.update({
        where: {
          id: parseInt(req.body.categoryId),
        },
        data: {
          offers: {
            connect: {
              id: updatedOffer.id,
            },
          },
        },
      });

      console.log("updated in category", category.offers);

      const subCategory = await prisma.subCategory.update({
        where: {
          id: parseInt(req.body.subCategoryId),
        },
        data: {
          offers: {
            connect: {
              id: updatedOffer.id,
            },
          },
        },
      });
      console.log("updated in sub cat", subCategory.offers);
    }
    res.json(updatedOffer);
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid Request");
  }
}

export async function deleteOffer(req, res) {
  try {
    const deletedOffer = await prisma.offer.delete({
      where: {
        id: parseInt(req.params.offerId),
      },
    });

    //now delete the offer from store, category and subCategory collections
    const store = await prisma.store.update({
      where: {
        id: parseInt(req.body.storeId),
      },
      data: {
        offers: {
          disconnect: {
            id: deletedOffer.id,
          },
        },
      },
    });
    console.log("deleted from store", store.offers);
    const category = await prisma.category.update({
      where: {
        id: parseInt(req.body.categoryId),
      },
      data: {
        offers: {
          disconnect: {
            id: deletedOffer.id,
          },
        },
      },
    });
    console.log("deleted from category", category.offers);
    const subCategory = await prisma.subCategory.update({
      where: {
        id: parseInt(req.body.subCategoryId),
      },
      data: {
        offers: {
          disconnect: {
            id: deletedOffer.id,
          },
        },
      },
    });
    console.log("deleted from sub cat", subCategory.offers);

    res.json(deletedOffer);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "couldnt delete offer" });
  }
}
