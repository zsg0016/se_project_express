const Item = require("../models/item");
const { errors } = require("../utils/errors");
const { HTTP_STATUS_CODES } = require("../utils/errors");

const getItems = (req, res) => {
  const itemId = req.itemId && (req.user._id ?? req.user);
  Item.find({})
    .then((items) => res.status(HTTP_STATUS_CODES.OK).send(items))
    .catch((error) => {
      console.error(error);
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.INTERNAL_SERVER_ERROR });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({
    name: name,
    weather: weather,
    imageUrl: imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(HTTP_STATUS_CODES.CREATED).send(item))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: errors.ITEM_VALIDATION_ERROR });
      }
      if (name) {
        if (name.length < 2 || name.length > 30) {
          return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
            message: errors.NAME_ERROR,
          });
        }
      }
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.ITEM_NOT_CREATED });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (req.user._id.toString() !== item.owner.toString()) {
        return res
          .status(HTTP_STATUS_CODES.FORBIDDEN)
          .send({ message: errors.ITEM_DELETE_FORBIDDEN });
      }
      return Item.findByIdAndDelete(itemId)
        .orFail()
        .then(() =>
          res
            .status(HTTP_STATUS_CODES.OK)
            .send({ message: errors.ITEM_DELETED })
        );
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: errors.ITEM_NOT_FOUND });
      }
      if (error.name === "CastError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: errors.INVALID_ITEM_ID });
      }
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.ITEM_NOT_DELETED });
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
      res.status(HTTP_STATUS_CODES.OK).send(item);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: errors.ITEM_NOT_FOUND });
      }
      if (error.name === "CastError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: errors.INVALID_ITEM_ID });
      }
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.ITEM_LIKE_ERROR });
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
      res.status(HTTP_STATUS_CODES.OK).send(item);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: errors.ITEM_NOT_FOUND });
      }
      if (error.name === "CastError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: errors.INVALID_ITEM_ID });
      }
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.ITEM_DISLIKE_ERROR });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
