
module.exports = {
  JWT_SECRET: require('crypto').randomBytes(64).toString('hex'),
};
