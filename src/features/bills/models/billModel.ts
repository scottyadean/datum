import { model, Model} from 'mongoose';
import { IBillDocument } from '../interfaces/billsInterface';
import mongoose, { Schema } from 'mongoose';
import { Helpers } from '../../../lib/utils/helpers';

export const houseSchema: Schema = new Schema({
  House_1st_Read: { type: Date, default: null },
  House_2nd_Read: { type: Date, default: null },
  House_Official: { type: String, default: '0' },
  House_Consent_Calendar_Date: { type: Date, default: null },
  House_Consent_Calendar_Object: { type: String, default: '0' },
  House_Maj_Caucus_Ind: { type: String, default: 'N' },
  House_Min_Caucus_Ind: { type: String, default: 'N' },
  House_Maj_Caucus_Date: { type: Date, default: null },
  House_Min_Caucus_Date: { type: Date, default: null },
});

export const senateSchema: Schema = new Schema({
  Senate_1st_Read: { type: Date, default: null },
  Senate_2nd_Read: { type: Date, default: null },
  Senate_Official: { type: String, default: '0' },
  Senate_Consent_Calendar_Date: { type: Date, default: null },
  Senate_Consent_Calendar_Object: { type: String, default: '0' },
  Senate_Maj_Caucus_Ind: { type: String, default: '0' },
  Senate_Min_Caucus_Ind: { type: String, default: '0' },
  Senate_Maj_Caucus_Date:  { type: Date, default: null },
  Senate_Min_Caucus_Date: { type: String, default: '0'}
});


export const sponsorsSchema: Schema = new Schema({
      profile_id:   { type: String, default: '' },
      origin_id: { type: Number, default: 0 },
      order: { type: Number, default: 0 },
      type: { type: String, default: '' },
      name: { type: String, default: '' },
      img: { type: String, default: '' }
});

export const transmitToSchema: Schema = new Schema({
  body: {type: String, default: 'S'},
  date: { type: Date, default: null },
  type: {type: String, default: '0'}
});

export const billSchema: Schema = new Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', index: true },  //"@Session_ID": "127",
  sessionOriginId: { type: Number, default: 0},
  billHostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  billNumber: { type: String, default: '' }, //  "@Bill_Number": "HB2003",
  slug: { type: String },
  name: { type: String },
  state: { type: String, default: 'AZ'},
  title: { type: String }, // "Short_Title": "corporate income tax; rates",
  catagory: { type: String, default: '' },
  subCatagory: { type: String, default: '' },
  description: { type: String, default: '' },
  summary: { type: String, default: '' },
  body: { type: Array, default: [] },
  currentBody: { type: String, default: ''},
  houseMeta: {houseSchema},
  senateMeta: {senateSchema},
  introducedAt: { type: Date, default: ''}, //"Introduced_Date": "2022-12-27T15:41:49",
  introducedBy: { type: String, default: ''},
  sections: { type: Array, default: [] },
  amendments: { type: Array, default: [] },
  contributors: { type: Array, default: [] },
  sponsors: [sponsorsSchema],
  requestsToEdit: { type: Array, default: [] },
  notes: { type: Array, default: [] },
  votes: { type: Array, default: [] },
  keywords: { type: Array, default: [] },
  journalGov: {type: String, default: '0'}, // "JournalGov": "0",
  postingSheet: {type: String, default: '0'}, // "PostingSheet": "0",
  nowPartOf: {type: String, default: '0'}, // "Now_Part_Of": "See HB 2257; SB 1352",
  documents: { type: Array, default: [] },
  videos: { type: Array, default: [] },
  sectionsAffected: { type: Array, default: [] },
  transmitTo: [transmitToSchema],
  submitted: { type: Boolean, default: false },
  submittedAt: { type: Date, default: null },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // "Last_Updated"

});




// create slug
billSchema.pre('save', function (): void {
    if (this.isModified('name')) {
        this.slug = Helpers.slugify(this.name);
    }
});

const BillModel: Model<IBillDocument> = model<IBillDocument>('Bill', billSchema, 'Bill');
export {BillModel};
