
import mongoose from 'mongoose';
export const postCommentSchema = {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', index: true },
    comment: { type: String, default: '' },
    username: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    createdAt: { type: Date, default: Date.now() }
};



// import Joi, { ObjectSchema } from 'joi';

// const addCommentSchema: ObjectSchema = Joi.object().keys({
//   userTo: Joi.string().required().messages({
//     'any.required': 'userTo is a required property'
//   }),
//   postId: Joi.string().required().messages({
//     'any.required': 'postId is a required property'
//   }),
//   comment: Joi.string().required().messages({
//     'any.required': 'comment is a required property'
//   }),
//   profilePicture: Joi.string().optional().allow(null, ''),
//   commentsCount: Joi.number().optional().allow(null, '')
// });

// export { addCommentSchema };
