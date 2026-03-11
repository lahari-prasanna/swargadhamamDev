const Joi = require("joi");

module.exports.gallerySchema = Joi.object({
  item: Joi.object({
    title: Joi.string().required(),

    image: Joi.object({
      url: Joi.string().uri().required(),
      filename: Joi.string().optional(),
    }).required(),
  }).required(),
});
