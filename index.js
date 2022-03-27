import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from 'cors'
import "dotenv/config";

//routes
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blog.js";
import categoryRoutes from "./routes/category.js";

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

app.use(express.json()) 
app.use(morgan("dev"));
//cors
const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions))

app.use("/admin", adminRoutes);
app.use("/blogs", blogRoutes);
app.use("/categories", categoryRoutes);

app.listen(PORT, () =>
  console.log("Server is running on http://localhost:" + PORT)
);
