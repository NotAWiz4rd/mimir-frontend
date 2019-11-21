import {Injectable} from '@angular/core';
import {Folder} from '../classes/Folder';
import {Space} from '../classes/Space';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {SpaceMetadata} from '../classes/SpaceMetadata';

const SPACE_TEST_PATH = 'https://se.pfuetsch.xyz/space/';

@Injectable()
export class SpaceService {
  currentSpace: Space;
  currentSpace$: BehaviorSubject<Space> = new BehaviorSubject<Space>(this.currentSpace);

  currentFolder: Folder;

  constructor(private http: HttpClient) {
  }

  loadSpace(spaceId: number, uploaded: boolean = false): Observable<Space> {
    if (spaceId != undefined && (this.currentSpace == undefined || (this.currentSpace.id != spaceId) || uploaded)) {
      this.http.get<Space>(SPACE_TEST_PATH + spaceId).subscribe(space => {
        this.currentSpace = space;
        console.log('loaded space: ' + spaceId);
        this.currentSpace$.next(this.currentSpace);
      });
    }
    return this.currentSpace$;
  }

  createSpace(name: string): Observable<SpaceMetadata> {
    return this.http.post<SpaceMetadata>(SPACE_TEST_PATH + '?name=' + name, {});
  }
}
