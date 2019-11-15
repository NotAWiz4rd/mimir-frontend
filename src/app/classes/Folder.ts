import {File} from './File';

export class Folder {
  id: number;
  name: string;
  owner: number;
  artifacts: File[];
  folders: Folder[];
  parentId: number;
}
