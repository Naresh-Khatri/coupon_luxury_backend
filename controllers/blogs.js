import imageKit from "../config/imagekitConfig.js";
import { removeImgFromImageKit } from "../config/imagekitConfig.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import serializer from "../utils/serializer.js";

export async function getPublicBlogs(req, res) {
  try {
    const allBlogs = await prisma.blog.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(allBlogs);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllBlogs(req, res) {
  try {
    const allBlogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(allBlogs);
  } catch (err) {
    console.log(err);
  }
}

export async function getBlog(req, res) {
  try {
    // console.log(req.params.blogId);
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(req.params.blogId),
      },
    });
    res.send(blog);
  } catch (err) {
    console.log(err);
  }
}
export async function getBlogWithSlug(req, res) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        slug: req.params.blogSlug,
      },
    });
    res.send(blog);
  } catch (err) {
    console.log(err);
  }
}

export async function createBlog(req, res) {
  try {
    console.log(req.body);
    //check if present already
    const blogExist = await prisma.blog.findUnique({
      where: {
        slug: req.body.slug,
      },
    });
    if (blogExist) {
      return res.status(409).json({
        message: "blog already exists",
      });
    }

    //upload coverImg and thumbnailImg to imageKit
    const promises = [
      imageKit.upload({
        file: req.files.coverImg.data,
        fileName: req.body.slug,
      }),
      imageKit.upload({
        file: req.files.thumbnailImg.data,
        fileName: req.body.slug,
      }),
    ];
    const results = await Promise.all(promises);
    // console.log(results);
    //create new blog
    const data = serializer({
      ...req.body,
      uid: req.user.uid,
      coverImg: results[0].url,
      thumbnailImg: results[1].url,
    });
    const newBlog = await prisma.blog.create({
      data,
    });
    //blog saved now add it to store model if storeId provided
    if (req.body.storeId) {
      const updatedStore = await prisma.store.update({
        where: {
          id: parseInt(req.body.storeId),
        },
        data: {
          blogs: {
            connect: {
              id: newBlog.id,
            },
          },
        },
      });
    }
    res.json(newBlog);
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "slug already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}

export async function updateBlog(req, res) {
  try {
    console.log(req.params.blogId, req.body, req.files);
    //check if image is provided
    if (req.files && req.files.coverImg) {
      //upload coverImg and thumbnailImg to imageKit
      const promises = [
        imageKit.upload({
          file: req.files.coverImg.data,
          fileName: req.body.slug,
        }),
        imageKit.upload({
          file: req.files.thumbnailImg.data,
          fileName: req.body.slug,
        }),
      ];
      const results = await Promise.all(promises);
      //update blog
      //TODO: check if double fetch is required
      const oldBlog = await prisma.blog.findUnique({
        where: {
          id: parseInt(req.params.blogId),
        },
      });
      const data = serializer({
        ...req.body,
        coverImg: results[0].url,
        thumbnailImg: results[1].url,
        uid: req.user.uid,
      });
      const updatedBlog = await prisma.blog.update({
        where: {
          id: parseInt(req.params.blogId),
        },
        data,
      });
      //delete coverImg and thumbnailImg from imageKit
      const oldCoverImg =
        oldBlog.coverImg.split("/")[oldBlog.coverImg.split("/").length - 1];
      const oldThumbnaiImg =
        oldBlog.thumbnailImg.split("/")[
          oldBlog.thumbnailImg.split("/").length - 1
        ];
      removeImgFromImageKit(oldCoverImg);
      removeImgFromImageKit(oldThumbnaiImg);
      res.json(updatedBlog);
    } else {
      //update blog
      const data = serializer(req.body);
      const updatedBlog = await prisma.blog.update({
        where: {
          id: parseInt(req.params.blogId),
        },
        data,
      });
      res.json(updatedBlog);
    }
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "slug already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}

export async function deleteBlog(req, res) {
  try {
    const deletedBlog = await prisma.blog.delete({
      where: {
        id: parseInt(req.params.blogId),
      },
    });
    //delete blog from store model
    if (deletedBlog.blogType === "store") {
      await prisma.store.update({
        where: {
          id: parseInt(deletedBlog.storeId),
        },
        data: {
          blogs: {
            disconnect: {
              id: deletedBlog.id,
            },
          },
        },
      });
    }
    //delete coverImg and thumbnailImg from imageKit
    const oldCoverImg =
      deletedBlog.coverImg.split("/")[
        deletedBlog.coverImg.split("/").length - 1
      ];
    const oldThumbnaiImg =
      deletedBlog.thumbnailImg.split("/")[
        deletedBlog.thumbnailImg.split("/").length - 1
      ];
    removeImgFromImageKit(oldCoverImg);
    removeImgFromImageKit(oldThumbnaiImg);
    res.json(deletedBlog);
  } catch (err) {
    console.log(err);
  }
}
