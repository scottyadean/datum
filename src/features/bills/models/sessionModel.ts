import { model, Model} from 'mongoose';
import { ISessionDocument } from '../interfaces/billsInterface';
import { Schema } from 'mongoose';
import { Helpers } from '../../../lib/utils/helpers';


export const sessionSchema: Schema = new Schema({
    origin_id: { type: Number, default: 0 },
    name: { type: String },
    slug: { type: String, default: '' },
    year: {type: Number, default: new Date().getFullYear()},
    state: {type: String, default: 'AZ', index: true},
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    sesson: { type: String, default: '' },
    notes: { type: String, default: '' },
    active: { type: Boolean, default: false },
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
