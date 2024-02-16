import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IBillBody {
        id: string | ObjectId;
        type: string;
        title: string;
        subTitle: string;
        body: string;
        status: string;
        version?: number;
        style?:string;
}

export interface IBillContributors {
        userId: string | ObjectId;
        fullname?: string;
        img?: string;
        role?: string;
}


export interface IBillSponsors{
        profile_id: string | ObjectId;
        origin_id: string|null;
        order: number;
        type: string;
        title: string;
        name: string;
        img: string;
}

export interface IBillNote {
        body: string;
        status: string;
        authorId: string | ObjectId;
        authorName: string;
        replies: [IBillNoteReply];
}

export interface IBillNoteReply {
        body: string;
        respondentName: string;
        respondentId: string | ObjectId;
}

export interface IBillVote{
        vote: string; //aye|nay
        voterId: string | ObjectId;
        voterName: string;
        stance: string; //for|against|neutral
        floor: string; //house|senate

}

export interface IBillKeywords{
        term: string;
}


export interface IBillSectionsAffected{
        title: string;
        sectionId: string;
        note: string;
}


/**
 * "@Document_Type": "F",
 * "@Document_Format": "PDF",
 * "@Description": "FISCAL NOTE: As Introduced",
 * "@Last_Updated": "2023-01-09T11:15:10.727",
 * "@URL": "legtext/56leg/1R/fiscal/HB2003.DOCX.pdf"
 */
export interface IBillDocuments{
        filename: string;
        catagory: string;
        updated_at: Date;
        paths: [{ format: string, link: string }];
}

export interface IBillVideos{
        filename: string;
        path: string;
        date?: Date;
        format?: string;
}

export interface IBillSection{
        name: string;
        url: string;
        description: string;
}

export interface IBillHouseMeta {
        House_1st_Read: Date|null;
        House_Official: string;
        House_2nd_Read: Date|null;
        House_Consent_Calendar_Date: Date|null;
        House_Consent_Calendar_Object: string;
        House_Maj_Caucus_Ind: string;
        House_Min_Caucus_Ind: string;
        House_Maj_Caucus_Date: Date|null;
        House_Min_Caucus_Date: Date|null;
}

export interface IBillSenateMeta {
        Senate_1st_Read: Date|null;
        Senate_Official: string;
        Senate_2nd_Read: Date|null;
        Senate_Consent_Calendar_Object: string;
}



export interface ITransmitTo {
        body: string;
        date: Date;
        Ind: string;
}

export interface IBillDocument extends Document {
        _id: string | ObjectId;
        sessionId: string| ObjectId;
        sessionOriginId?: number|null;
        billHostId: string| ObjectId;
        billNumber: string;
        slug?: string;
        name: string;
        state: string;
        title: string;
        catagory: string;
        subCatagory:string;
        description: string;
        summary: string;
        body: [IBillBody];
        currentBody?: string;
        houseMeta?: IBillHouseMeta|null;
        senateMeta?: IBillSenateMeta|null;
        introducedAt?: Date|null;
        introducedBy?: string;
        sections: [IBillSection];
        amendments: [IBillBody];
        contributors: [ IBillContributors ];
        sponsors: [IBillSponsors];
        requestsToEdit: [IBillContributors];
        notes: [IBillNote];
        votes: [IBillVote];
        keywords: [IBillKeywords];
        journalGov?: string;
        postingSheet?: string;
        nowPartOf?: string;
        documents: [IBillDocuments];
        videos: [IBillVideos];
        sectionsAffected: [IBillSectionsAffected];
        transmitTo: ITransmitTo|null;
        submitted?: boolean;
        submittedAt?: Date|null;
        deleted?: boolean|null;
        createdAt?: Date;
        updatedAt?: Date|null|string;
}



/**
 * ---------------------------------
 * Data Modal from az.gov
 * -------------------------------------
 *  "@Session_ID": "127",
 *  "@Session_Full_Name": "Fifty-sixth Legislature - First Regular Session",
 *  "@Legislature": "56",
 *  "@Session": "1R",
 *  "@Legislation_Year": "2023",
 *  "@Session_Start_Date": "2023-01-09T12:00:00",
 *  "@Sine_Die_Date": "2023-07-31T17:15:00"
 *
 */
export interface ISessionDocument extends Document {
                _id: string | ObjectId;
                slug?: string; // "@Session_Full_Name" formated
                origin_id?: number|null, //"@Session_ID": "127",
                name: string; // "@Session_Full_Name"
                description: string; // "@Session_Full_Name"
                state:string; // AZ
                year: number; // "@Legislation_Year"
                start_date: Date; // "@Session_Start_Date"
                end_date: Date; // "@Sine_Die_Date"
                sesson: string; // "@Session"
                notes?: string;
                active: boolean;
                extended?:Date|null;
                createdAt: Date;
}


