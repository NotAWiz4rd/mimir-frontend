import {Injectable} from '@angular/core';

@Injectable()
export class SpaceService {
  // this loads and stores all spaces
  currentSpace: string = '';

  constructor() {
  }
}
