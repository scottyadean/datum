 
    import { Document } from 'mongoose';
    import { ObjectId } from 'mongodb';

    export interface IAdminDocument extends Document {
            _id: string | ObjectId;
            name: string
    }