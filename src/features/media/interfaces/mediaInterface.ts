 
    import { Document } from 'mongoose';
    import { ObjectId } from 'mongodb';

    export interface IMediaDocument extends Document {
            _id: string | ObjectId;
            name: string
    }