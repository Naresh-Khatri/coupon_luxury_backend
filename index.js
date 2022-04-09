import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

//routes
import adminRoutes from "./routes/admin.js";
import categoryRoutes from "./routes/category.js";
import subCategoryRoutes from "./routes/subCategory.js";
import storeRoutes from "./routes/store.js";
import offerRoutes from "./routes/offer.js";
import blogRoutes from "./routes/blog.js";
import statsRoutes from "./routes/stats.js";
import subscriptionRoutes from "./routes/subscription.js";
import pageRoutes from "./routes/page.js";

const app = express();
const PORT = process.env.PORT || 3000;

//DB connection
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("DB connection error: ", err);
    } else {
      console.log("DB connected");
    }
  }
);

app.use(express.json());
app.use(morgan("dev"));
//cors
const corsOptions = {
  origin:["http://localhost:8080","http://localhost:3000",'http://localhost:9100'],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/admin", adminRoutes);
app.use("/stats", statsRoutes);
app.use("/blogs", blogRoutes);
app.use("/categories", categoryRoutes);
app.use("/sub-categories", subCategoryRoutes);
app.use("/stores", storeRoutes);
app.use("/offers", offerRoutes);
app.use("/blogs", blogRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/page', pageRoutes)

app.listen(PORT, () =>
  console.log("Server is running on http://localhost:" + PORT)
);
