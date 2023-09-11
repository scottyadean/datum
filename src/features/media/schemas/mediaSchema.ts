
    import { IMediaDocument } from '../interfaces/mediaInterface';
    import mongoose, { model, Model, Schema } from 'mongoose';

    const mediaSchema: Schema = new Schema({

        name: { type: String, index: true },

    });

    const MediaModel: Model<IMediaDocument> = model<IMediaDocument>('Media', mediaSchema, 'Media');
    export {MediaModel};
