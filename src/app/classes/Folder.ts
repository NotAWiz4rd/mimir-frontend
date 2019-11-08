import {File} from './File';

export class Folder {
  id: number;
  name: string;
  owner: number;
  files: File[];
  folders: Folder[];
  parentId: number;
}
