import {SpaceMetadata} from './SpaceMetadata';

export class User {
  id: number;
  username: string;
  mail: string;
  profileImageId: number;
  spaces: SpaceMetadata[];
}
