import { Document, Types } from 'mongoose';
export type MaintenanceRequestDocument = MaintenanceRequest & Document;
export declare class MaintenanceRequest {
    propertyId: Types.ObjectId;
    description: string;
    urgency: string;
    category: string;
    status: string;
    triagedAt: Date | null;
}
export declare const MaintenanceRequestSchema: import("mongoose").Schema<MaintenanceRequest, import("mongoose").Model<MaintenanceRequest, any, any, any, Document<unknown, any, MaintenanceRequest, any, {}> & MaintenanceRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MaintenanceRequest, Document<unknown, {}, import("mongoose").FlatRecord<MaintenanceRequest>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<MaintenanceRequest> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
