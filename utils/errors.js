const errors = {
  RESOURCE_NOT_FOUND: "Requested resource not found",
  INVALID_URL: "You must enter a valid URL",
  NAME_ERROR: "User name must be between 2 and 30 characters long",
  USER_VALIDATION_ERROR: "Validation error: Either name or url is invalid",
  ITEM_VALIDATION_ERROR:
    "Validation error: Either name, weather, or url is invalid",
  INVALID_USER_ID: "Invalid user ID",
  INVALID_ITEM_ID: "Invalid item ID",
  USERS_NOT_FOUND: "No users found",
  ITEMS_NOT_FOUND: "No items found",
  USER_NOT_CREATED: "User could not be created",
  USER_NOT_FOUND: "User not found",
  ITEM_NOT_CREATED: "Item could not be created",
  ITEM_NOT_FOUND: "Item not found",
  ITEM_NOT_DELETED: "Item could not be deleted",
  ITEM_DELETED: "Item deleted successfully",
  ITEM_DELETE_FORBIDDEN: "You do not have permission to delete this item",
  ITEM_LIKE_ERROR: "Could not like item",
  ITEM_DISLIKE_ERROR: "Could not dislike item",
  INVALID_PASSWORD: "Invalid password",
  DUPLICATE_EMAIL: "Email already exists",
  INTERNAL_SERVER_ERROR: "An internal server error occurred",
  INVALID_EMAIL: "You must enter a valid email address",
  LOGIN_FAILED: "Login failed: Invalid email or password",
  UNAUTHORIZED: "Authorization required",
  MISSING_FIELDS: "Email and password are required",
};

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  errors,
  HTTP_STATUS_CODES,
};
