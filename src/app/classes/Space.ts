import {Folder} from './Folder';
import {User} from './User';

export class Space {
  id: number;
  name: string;
  root: Folder;
  owner: User;
  users: User[];
  thumnbailId: number;
}
