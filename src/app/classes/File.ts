import {Comment} from './Comment';

export class File {
  id: number;
  name: string;
  author: number;
  type: string;
  creationDate: number;
  parentId: number;
  comments: Comment[];
}
