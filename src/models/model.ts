import { Model } from 'mongoose';
import { IWordModel } from './word';

export interface IModel {
    word: Model<IWordModel>
}
