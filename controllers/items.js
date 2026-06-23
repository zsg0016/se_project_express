const Item = require("../models/item");
const { errors } = require("../utils/errors");
const { HTTP_STATUS_CODES } = require("../utils/errors");

const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequestError } = require("../errors/BadRequestError");
const { ForbiddenError } = require("../errors/ForbiddenError");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(HTTP_STATUS_CODES.OK).send(items))
    .catch((error) => {
      next(error);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(HTTP_STATUS_CODES.CREATED).send(item))
    .catch((error) => {
      let err;
      if (error.name === "ValidationError") {
        err = new BadRequestError(errors.ITEM_VALIDATION_ERROR);
      }
      if (name) {
        if (name.length < 2 || name.length > 30) {
          err = new BadRequestError(errors.NAME_ERROR);
        }
      }
      if (err === undefined) err = new Error(errors.ITEM_NOT_CREATED);
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  let err;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (req.user._id.toString() !== item.owner.toString()) {
        err = new ForbiddenError(errors.ITEM_DELETE_FORBIDDEN);
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
      if (error.name === "DocumentNotFoundError") {
        err = new NotFoundError(errors.ITEM_NOT_FOUND);
      }
      if (error.name === "CastError") {
        err = new BadRequestError(errors.INVALID_ITEM_ID);
      }
      if (err === undefined) err = new Error(errors.ITEM_NOT_DELETED);
      next(err);
    });
};

const likeItem = (req, res, next) => {
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
      let err;
      if (error.name === "DocumentNotFoundError") {
        err = new NotFoundError(errors.ITEM_NOT_FOUND);
      }
      if (error.name === "CastError") {
        err = new BadRequestError(errors.INVALID_ITEM_ID);
      }
      if (err === undefined) err = new Error(errors.ITEM_LIKE_ERROR);
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
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
      let err;
      if (error.name === "DocumentNotFoundError") {
        err = new NotFoundError(errors.ITEM_NOT_FOUND);
      }
      if (error.name === "CastError") {
        err = new BadRequestError(errors.INVALID_ITEM_ID);
      }
      if (err === undefined) err = new Error(errors.ITEM_DISLIKE_ERROR);
      next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
