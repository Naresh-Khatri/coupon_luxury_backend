import express from "express";

const Router = express.Router();

Router.get("/about", async(req, res)=>{
    res.send('about');
});

export default Router;
