
    import { IAdminDocument } from '../interfaces/adminInterface';
    import { model, Model, Schema } from 'mongoose';

    const adminSchema: Schema = new Schema({
        name: { type: String, index: true },
    });

    const AdminModel: Model<IAdminDocument> = model<IAdminDocument>('Admin', adminSchema, 'Admin');
    export {AdminModel};
