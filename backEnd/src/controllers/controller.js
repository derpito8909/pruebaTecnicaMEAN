export const getAllItems = (model) => async (req, res, next) => {
  try {
    const items = await model.find({});

    if (items.length === 0) {
      return res.status(404).send("item no encontrado");
    }
    return res.status(200).send(items);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getItemById = (model) => async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await model.findById(id);
    if (!item) {
      return res.status(404).send("item no encontrado");
    }

    res.status(200).send(item);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const createItem = (model) => async (req, res, next) => {
  try {
    const item = new model(req.body);

    await item.save();
    res.status(201).json({
      mensaje: "Item creado Correctamente",
      datos: item,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const updateItem = (model) => async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!item) {
      return res.status(404).send("item no encontrado");
    }
    res.status(200).json({
      mensaje: "Item actualizado correctamente",
      datos: item,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deleteItem = (model) => async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await model.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).send("item no encontrado");
    }
    res.status(200).json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    return res.status(500).send(error);
  }
};
