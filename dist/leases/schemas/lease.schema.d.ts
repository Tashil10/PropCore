import { Document, Types } from 'mongoose';
export type LeaseDocument = Lease & Document;
export declare class Lease {
    propertyId: Types.ObjectId;
    extractedTerms: Record<string, unknown>;
    status: string;
    originalFileName: string | null;
}
export declare const LeaseSchema: import("mongoose").Schema<Lease, import("mongoose").Model<Lease, any, any, any, Document<unknown, any, Lease, any, {}> & Lease & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lease, Document<unknown, {}, import("mongoose").FlatRecord<Lease>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Lease> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
