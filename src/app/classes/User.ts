import {SpaceMetadata} from './SpaceMetadata';

export class User {
  id: number;
  name: string;
  mail: string;
  profileImageId: number;
  spaces: SpaceMetadata[];
}
