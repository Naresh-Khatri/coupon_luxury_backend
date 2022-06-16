import express from "express";
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";

import BlogModel from "../models/BlogModel.js";
import OfferModel from "../models/offerModel.js";
import storeModel from "../models/storeModel.js";
import CategoryModel from "../models/categoryModel.js";

const Router = express.Router();

let sitemap;

Router.get("/", async (req, res) => {
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
        url: "https://couponluxury.com",
        changefreq: "monthly",
        priority: 1,
      },
    ],
    result.map((type) => type.value)
  );
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap);
    return;
  }
  try {
    const smStream = new SitemapStream();
    const pipeline = smStream.pipe(createGzip());
    // pipe your entries or directly write them.

    sitemapURLs.forEach((link) => {
      smStream.write(link);
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

const getSlugs = (type) => {
  switch (type) {
    case "offers":
      return new Promise((resolve, reject) => {
        OfferModel.find({ active: true })
          .select("slug updatedAt -_id")
          .then((offers) => {
            const offersSitemap = offers.map((offer) => {
              return {
                url: "https://couponluxury.com/deal/" + offer.slug,
                lastmod: offer.updatedAt,
                changefreq: "daily",
                priority: 0.8,
              };
            });
            resolve(offersSitemap);
          });
      });

    case "blogs":
      return new Promise((resolve, reject) => {
        BlogModel.find({ active: true })
          .select("slug updatedAt -_id")
          .then((blogs) => {
            const blogsSitemap = blogs.map((blog) => {
              return {
                url: "https://couponluxury.com/blogs/" + blog.slug,
                lastmod: blog.updatedAt,
                changefreq: "daily",
                priority: 0.8,
              };
            });
            resolve(blogsSitemap);
          });
      });

    case "categories":
      return new Promise((resolve, reject) => {
        CategoryModel.find({ active: true })
          .select("slug updatedAt -_id")
          .then((categories) => {
            const categoriesSitemap = categories.map((category) => {
              return {
                url: "https://couponluxury.com/categories/" + category.slug,
                lastmod: category.updatedAt,
                changefreq: "weekly",
                priority: 0.8,
              };
            });
            resolve(categoriesSitemap);
          });
      });

    case "stores":
      return new Promise((resolve, reject) => {
        storeModel
          .find({ active: true })
          .select("slug updatedAt -_id")
          .then((stores) => {
            const storesSitemap = stores.map((store) => {
              return {
                url: "https://couponluxury.com/stores/" + store.slug,
                lastmod: store.updatedAt,
                changefreq: "daily",
                priority: 0.8,
              };
            });
            resolve(storesSitemap);
          });
      });

    default:
      return [];
  }
};
