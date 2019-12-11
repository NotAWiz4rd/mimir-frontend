import {Comment} from './Comment';

export class File {
  id: number;
  name: string;
  author: number;
  creationDate: number;
  parentId: number;
  comments: Comment[];
}
