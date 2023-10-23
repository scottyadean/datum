import { model, Model} from 'mongoose';
import { ISessionDocument } from '../interfaces/billsInterface';
import { Schema } from 'mongoose';

import { Helpers } from '../../../lib/utils/helpers';

export const sessionSchema: Schema = new Schema({
    name: { type: String },
    slug: { type: String, default: '' },
    year: {type: Number, default: new Date().getFullYear()},
    state: {type: String, default: 'AZ'},
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    special: { type: String, default: '' },
    extended: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

// create slug
sessionSchema.pre('save', function (): void {
    if (this.isModified('name')) {
        this.slug = Helpers.slugify(this.name);
    }
});

const SessionModel: Model<ISessionDocument> = model<ISessionDocument>('Session', sessionSchema, 'Session');
export {SessionModel};
