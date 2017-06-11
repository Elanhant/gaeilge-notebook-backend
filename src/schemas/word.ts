import { Schema } from 'mongoose';

export const wordSchema: Schema = new Schema({
    root: {
        type: String,
        required: true,
        unique: true
    },
    definition: String,
    translations: [String],
    derivatives: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
