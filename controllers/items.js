const Item = require("../models/item");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      return res.status(200).send(items);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: error.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  module.exports.createClothingItem = (req, res) => {
    console.log(req.user._id); // _id will become accessible
  };
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      if (name.length < 2 || name.length > 30) {
        return res.status(400).send({
          message: "Item name must be between 2 and 30 characters long",
        });
      }
      return res.status(500).send({ message: error.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      } else if (error.name === "CastError") {
        return res.status(400).send({ message: error.message });
      }
      return res.status(500).send({ message: error.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      } else if (error.name === "CastError") {
        return res.status(400).send({ message: error.message });
      }
      return res.status(500).send({ message: error.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      } else if (error.name === "CastError") {
        return res.status(400).send({ message: error.message });
      }
      return res.status(500).send({ message: error.message });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
