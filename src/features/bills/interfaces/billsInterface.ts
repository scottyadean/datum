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
        type: string;
        title: string;
        name: string;

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


export interface IBillDocuments{
        filename: string;
        catagory: string;
        paths: [{ format: string, link: string }];
}

export interface IBillVideos{
        filename: string;
        path: string;
        date?: Date;
        format?: string;
}

export interface IBillSubject{
        name: string;
        url: string;
        description: string;
}

export interface IBillDocument extends Document {
        _id: string | ObjectId;
        sessionId: string| ObjectId;
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
        subjects: [IBillSubject];
        amendments: [IBillBody];
        contributors: [ IBillContributors ];
        sponsors: [IBillSponsors];
        requestsToEdit: [IBillContributors];
        notes: [IBillNote];
        votesHouse: [IBillVote];
        votesSenate: [IBillVote];
        keywords: [IBillKeywords];
        documents: [IBillDocuments];
        videos: [IBillVideos];
        sectionsAffected: [IBillSectionsAffected];
        submitted?: boolean;
        submittedAt?: Date|null;
        deleted?: boolean|null;
        createdAt?: Date;
        updatedAt?: Date|null|string;
}


export interface ISessionDocument extends Document {
        _id: string | ObjectId;
        name: string;
        state:string;
        year: number;
        slug?: string;
        description: string;
        start_date: Date;
        end_date: Date;
        special: string;
        extended?:Date|null;
        createdAt: Date;
}
