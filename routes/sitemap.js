import express from "express";
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Router = express.Router();

let sitemap;

Router.get("/", async (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  const promises = [
    getSlugs("stores"),
    getSlugs("offers"),
    getSlugs("blogs"),
    getSlugs("categories"),
  ];

  const result = await Promise.allSettled(promises);
  const sitemapURLs = [].concat.apply(
    [
      {
        url: "https://www.couponluxury.com",
        changefreq: "monthly",
        priority: 1,
      },
      {
        url: "https://www.couponluxury.com/stores",
        changefreq: "monthly",
        priority: 0.8,
      },
      {
        url: "https://www.couponluxury.com/blogs",
        changefreq: "monthly",
        priority: 0.8,
      },
      {
        url: "https://www.couponluxury.com/about",
        changefreq: "yearly",
        priority: 0.8,
      },
      {
        url: "https://www.couponluxury.com/contact",
        changefreq: "yearly",
        priority: 0.8,
      },
      {
        url: "https://www.couponluxury.com/privacy-policy",
        changefreq: "yearly",
        priority: 0.8,
      },
    ],
    result.map((type) => type.value)
  );
  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap);
    return;
  }
  // console.log(sitemapURLs)
  try {
    const smStream = new SitemapStream({
      hostname: "https://couponluxury.com/",
    });
    const pipeline = smStream.pipe(createGzip());

    // pipe your entries or directly write them.
    sitemapURLs.forEach((link) => {
      //sometimes link doesnt contain url prop idkw
      if (link?.url) smStream.write(link);
    });
    // cache the response
    streamToPromise(pipeline).then((sm) => (sitemap = sm));

    //remove cached entry after 1 min
    setTimeout(() => {
      sitemap = null;
    }, 60 * 1000);

    // make sure to attach a write stream such as streamToPromise before ending
    smStream.end();
    // stream write the response
    pipeline.pipe(res).on("error", (e) => {
      throw e;
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});
export default Router;

const getSlugs = async (type) => {
  switch (type) {
    case "offers":
      const offers = await prisma.offer.findMany({
        where: {
          active: true,
        },
        orderBy: {
          title: "asc",
        },
        select: {
          id: false,
          slug: true,
          updatedAt: true,
        },
      });
      const offersSitemap = offers.map((offer) => {
        return {
          url: "https://www.couponluxury.com/deals/" + offer.slug,
          lastmod: offer.updatedAt,
          changefreq: "daily",
          priority: 0.8,
        };
      });
      return offersSitemap;
    case "blogs":
      const blogs = await prisma.blog.findMany({
        where: {
          active: true,
        },
        orderBy: {
          title: "asc",
        },
        select: {
          id: false,
          slug: true,
          updatedAt: true,
        },
      });
      const blogsSitemap = blogs.map((blog) => {
        return {
          url: "https://www.couponluxury.com/blogs/" + blog.slug,
          lastmod: blog.updatedAt,
          changefreq: "daily",
          priority: 0.8,
        };
      });

      return blogsSitemap;

    case "categories":
      const categories = await prisma.category.findMany({
        where: {
          active: true,
        },
        orderBy: {
          categoryName: "asc",
        },
        select: {
          id: false,
          slug: true,
          updatedAt: true,
        },
      });
      const categoriesSitemap = categories.map((category) => {
        return {
          url: "https://www.couponluxury.com/categories/" + category.slug,
          lastmod: category.updatedAt,
          changefreq: "daily",
          priority: 0.8,
        };
      });
      return categoriesSitemap;

    case "stores":
      const stores = await prisma.store.findMany({
        where: {
          active: true,
        },
        orderBy: {
          storeName: "asc",
        },
        select: {
          id: false,
          slug: true,
          updatedAt: true,
        },
      });
      const storesSitemap = stores.map((store) => {
        return {
          url: "https://www.couponluxury.com/stores/" + store.slug,
          lastmod: store.updatedAt,
          changefreq: "daily",
          priority: 0.8,
        };
      });
      return storesSitemap;

    default:
      return [];
  }
};
