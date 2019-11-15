import {Comment} from './Comment';

export class File {
  id: number;
  name: string;
  author: number;
  contentType: string;
  creationDate: number;
  parentId: number;
  comments: Comment[];
}
