const Joi = require('@hapi/joi');

exports.register_validation = Joi.object({

    name:Joi.string()
            .trim()
            .alphanum()
            .min(2)
            .max(40)
            .required(),
    
    email:Joi.string()
            .required()
            .email(),

    password:Joi.string()
            .trim()
            .required()
            .min(4)
});

exports.login_validation = Joi.object({

        email:Joi.string()
                .trim()
                .required()
                .email(),
        password:Joi.string()
                .trim()
                .min(4)
                .required()
});