import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

import compression from "compression";

//routes
import sitemapRoutes from "./routes/sitemap.js";
import adminRoutes from "./routes/admin.js";
import categoryRoutes from "./routes/category.js";
import subCategoryRoutes from "./routes/subCategory.js";
import storeRoutes from "./routes/store.js";
import offerRoutes from "./routes/offer.js";
import blogRoutes from "./routes/blog.js";
import statsRoutes from "./routes/stats.js";
import subscribersRoutes from "./routes/subscription.js";
import slideRoutes from "./routes/slide.js";
import miscRoutes from "./routes/misc.js";
import bgVideoRoutes from "./routes/backgroundVideo.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
const PORT = process.env.PORT || 3000;

//DB connection
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true, //make this also true
  },
  (err) => {
    if (err) {
      console.log("DB connection error: ", err);
    } else {
      console.log("DB connected");
    }
  }
);
app.use(compression());
app.use(morgan("dev"));

//cors
// const corsOptions = {
//   origin: [
//     "http://localhost:8080",
//     "http://localhost:3000",
//     "http://localhost:9100",
//     "https://cl.panipuri.tech/",
//   ],
//   optionsSuccessStatus: 200,
//   credentials: true,
// };
// app.use(cors(corsOptions));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use((req, res, next) => {
  try {
    decodeURIComponent(req.path);
    next();
  } catch (err) {
    console.log(err, req.path);
    res.send("400 Bad Request");
  }
});
app.use('/sitemap.xml', sitemapRoutes);
app.use("/admin", adminRoutes);
app.use("/stats", statsRoutes);
app.use("/blogs", blogRoutes);
app.use("/slides", slideRoutes);
app.use("/categories", categoryRoutes);
app.use("/sub-categories", subCategoryRoutes);
app.use("/stores", storeRoutes);
app.use("/offers", offerRoutes);
app.use("/blogs", blogRoutes);
app.use("/subscribers", subscribersRoutes);
app.use("/misc", miscRoutes);
app.use("/bg-video", bgVideoRoutes);
app.use("/uploads", uploadRoutes);

app.post("/test", async (req, res) => {
  console.log(req.body);
});

app.listen(PORT, () =>
  console.log("Server is running on http://localhost:" + PORT)
);
