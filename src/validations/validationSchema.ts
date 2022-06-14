import Joi from "joi";

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createUserSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const completeWalletFundingSchema = Joi.object().keys({
  reference: Joi.string().required()
});

export const fundWalletSchema = Joi.object().keys({
  amount: Joi.number().required().min(0)
});

export const transferSchema = Joi.object().keys({
  amount: Joi.number().required().min(0),
  email: Joi.string().email().required(),
});
