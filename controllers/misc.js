import categoryModel from "../models/categoryModel.js";

export async function getSitemap(req, res) {
  const categories = await categoryModel
    .find({ active: true })
    .select("image categoryName slug subcategories description")
    .populate("subCategories", "subCategoryName slug");
  res.json(categories);
}
