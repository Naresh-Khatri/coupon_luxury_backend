import serializer from "../utils/serializer.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllSubs(req, res) {
  try {
    const allSubs = await prisma.subscriber.findMany();
    // const allSubs = await subscriberModel.find({}).sort({ createdAt: -1 });
    console.log(allSubs);
    res.send(allSubs);
  } catch (err) {
    res.status(400).send("Invalid Request");
    console.log(err);
  }
}

export async function getSub(req, res) {
  try {
    console.log(req.params.subId);
    const sub = await prisma.subscriber.findUnique({
      where: {
        id: parseInt(req.params.subId),
      },
    });
    // const subscriber = await subscriberModel.findById(req.params.subCategoryId);
    res.send(subscriber);
  } catch (err) {
    res.status(400).send("Invalid Request");
    console.log(err);
  }
}

export async function createSub(req, res) {
  try {
    const data = serializer(req.body);
    const newSub = await prisma.subscriber.create({
      data,
    });
    res.send(newSub);
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "subscriber already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}

export async function updateSub(req, res) {
  try {
    // console.log(req.params.subCategoryId, req.body, req.files);
    const data = serializer(req.body);
    const updatedSub = await prisma.subscriber.update({
      where: {
        id: parseInt(req.params.subId),
      },
      data,
    });
    res.json(updatedSub);
  } catch (err) {
    console.log(err);
    if (err.code === "P2002")
      res.status(400).json({ err: "subscriber already exists", code: err.code });
    else res.status(400).send("Invalid Request");
  }
}

export async function deleteSub(req, res) {
  try {
    const deletedSub = await prisma.subscriber.delete({
      where: {
        id: parseInt(req.params.subId),
      },
    });
    res.json(deletedSub);
  } catch (err) {
    res.status(400).send("Invalid Request");
    console.log(err);
  }
}
