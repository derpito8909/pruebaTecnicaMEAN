import { Router } from "express";
import { createItem, getAllItems, getItemById, updateItem, deleteItem } from "../controllers/controller.js";

export const createRoutesForModel = (model, routeName, app) => {
  const router = Router();

  router.post("/", createItem(model));

  router.put("/:id", updateItem(model));

  router.get("/", getAllItems(model));

  router.get("/:id", getItemById(model));

  router.delete("/:id", deleteItem(model));

  app.use(`/${routeName}`, router);
};
