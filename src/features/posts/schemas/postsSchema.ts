import mongoose from 'mongoose';

export const postSchema = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  username: { type: String },
  email: { type: String },
  avatarColor: { type: String },
  profilePicture: { type: String },
  post: { type: String, default: '' },
  bgColor: { type: String, default: '' },
  imgVersion: { type: String, default: '' },
  imgId: { type: String, default: '' },
  feelings: { type: String, default: '' },
  gifUrl: { type: String, default: '' },
  privacy: { type: String, default: '' },
  commentsCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    lol: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
};


// import Joi, { ObjectSchema } from 'joi';

// const postSchema: ObjectSchema = Joi.object().keys({
//   post: Joi.string().optional().allow(null, ''),
//   bgColor: Joi.string().optional().allow(null, ''),
//   privacy: Joi.string().optional().allow(null, ''),
//   feelings: Joi.string().optional().allow(null, ''),
//   gifUrl: Joi.string().optional().allow(null, ''),
//   profilePicture: Joi.string().optional().allow(null, ''),
//   imgVersion: Joi.string().optional().allow(null, ''),
//   imgId: Joi.string().optional().allow(null, ''),
//   image: Joi.string().optional().allow(null, '')
// });

// const postWithImageSchema: ObjectSchema = Joi.object().keys({
//   image: Joi.string().required().messages({
//     'any.required': 'Image is a required field',
//     'string.empty': 'Image property is not allowed to be empty'
//   }),
//   post: Joi.string().optional().allow(null, ''),
//   bgColor: Joi.string().optional().allow(null, ''),
//   privacy: Joi.string().optional().allow(null, ''),
//   feelings: Joi.string().optional().allow(null, ''),
//   gifUrl: Joi.string().optional().allow(null, ''),
//   profilePicture: Joi.string().optional().allow(null, ''),
//   imgVersion: Joi.string().optional().allow(null, ''),
//   imgId: Joi.string().optional().allow(null, '')
// });

// export { postSchema, postWithImageSchema };
