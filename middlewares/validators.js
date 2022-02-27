const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateCreateCard = celebrate({
  body: {
    name: Joi.string().min(2).required().messages({
      "string.min": "Минимальная длина - 2 символа",
      "any.required": "Поле обязательно для заполнения",
    }),
    link: Joi.string()
      .min(2)
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message("Невалидная ссылка");
      })
      .messages({
        "string.min": "Минимальная длина - 2 символа",
        "any.required": "Поле обязательно для заполнения",
      }),
  },
});

const validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

const validateUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

const validateUser = celebrate({
  body: {
    email: Joi.string()
      .min(2)
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message("Невалидный емаил");
      })
      .messages({
        "string.min": "Минимальная длина - 2 символа",
        "any.required": "Поле обязательно для заполнения",
      }),
    password: Joi.string().min(2).required().messages({
      "string.min": "Минимальная длина - 2 символа",
      "any.required": "Поле обязательно для заполнения",
    }),
  },
});

const validateProfileData = celebrate({
  body: {
    name: Joi.string().min(2).required().messages({
      "string.min": "Минимальная длина - 2 символа",
      "any.required": "Поле обязательно для заполнения",
    }),
    about: Joi.string().min(2).required().messages({
      "string.min": "Минимальная длина - 2 символа",
      "any.required": "Поле обязательно для заполнения",
    }),
  },
});

const validateProfileAvatar = celebrate({
  body: {
    avatar: Joi.string()
      .min(2)
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message("Невалидная ссылка");
      })
      .messages({
        "string.min": "Минимальная длина - 2 символа",
        "any.required": "Поле обязательно для заполнения",
      }),
  },
});

module.exports = {
  validateCreateCard,
  validateCardById,
  validateUserById,
  validateUser,
  validateProfileData,
  validateProfileAvatar,
};
