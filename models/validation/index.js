const Joi = require("@hapi/joi");

const ValidateAccount = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        register_as: Joi.string().required(),
        register_id: Joi.string().required(),
    })

    return schema.validate(data)
}

const validateLogin = data => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })

    return schema.validate(data)
}

const validatePickup = data => {
    const schema = Joi.object({
        pick_location: Joi.string().required(),
        destination: Joi.string().required(),
        userId: Joi.string().required(),
        time: Joi.string().required(),
        number_of_students: Joi.number().required(),
        payment: Joi.string().required(),
    })

    return schema.validate(data)
}


module.exports.ValidateAccount = ValidateAccount;
module.exports.validateLogin = validateLogin;
module.exports.validatePickup = validatePickup;