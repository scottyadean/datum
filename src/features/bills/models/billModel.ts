import { model, Model} from 'mongoose';
import { IBillDocument } from '../interfaces/billsInterface';
import mongoose, { Schema } from 'mongoose';

import { Helpers } from '../../../lib/utils/helpers';


export const billSchema: Schema = new Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', index: true },
  billHostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  billNumber: { type: String, default: '' },
  slug: { type: String },
  name: { type: String },
  state: { type: String, default: 'CA'},
  title: { type: String },
  catagory: { type: String, default: '' },
  subCatagory: { type: String, default: '' },
  description: { type: String, default: '' },
  summary: { type: String, default: '' },
  body: { type: Array, default: [] },
  sections: { type: Array, default: [] },
  amendments: { type: Array, default: [] },
  contributors: { type: Array, default: [] },
  sponsors: { type: Array, default: [] },
  requestsToEdit: { type: Array, default: [] },
  notes: { type: Array, default: [] },
  votesHouse: { type: Array, default: [] },
  votesSenate: { type: Array, default: [] },
  keywords: { type: Array, default: [] },
  documents: { type: Array, default: [] },
  videos: { type: Array, default: [] },
  sectionsAffected: { type: Array, default: [] },
  submitted: { type: Boolean, default: false },
  submittedAt: { type: Date, default: null },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


// create slug
billSchema.pre('save', function (): void {
    if (this.isModified('name')) {
        this.slug = Helpers.slugify(this.name);
    }
});

const BillModel: Model<IBillDocument> = model<IBillDocument>('Bill', billSchema, 'Bill');


export {BillModel};
