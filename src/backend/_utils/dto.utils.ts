import Joi from 'joi';

export const JoiStringArray = Joi.array().items(Joi.string());
