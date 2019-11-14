import {Folder} from './Folder';

export class Space {
  id: number;
  name: string;
  root: Folder;
  owner: number;
  users: number[];
  thumnbailId: number;
}
