const Joi = require('@hapi/joi');


exports.post_validation = Joi.object({

    title:Joi.string()
        .trim()
        .required()
        .max(150)
        .alphanum(),

    content:Joi.string()
            .trim()
            .required()
});