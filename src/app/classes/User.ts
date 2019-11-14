import {SpaceMetadata} from './SpaceMetadata';

export class User {
  id: number;
  username: string;
  password: string;
  profileImageId: number;
  spaces: SpaceMetadata[];
}
