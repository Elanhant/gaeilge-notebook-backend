import { Document } from 'mongoose';
import { IWord } from '../interfaces/word';

export interface IWordModel extends IWord, Document {

}
