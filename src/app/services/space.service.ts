import {Injectable} from '@angular/core';
import {Folder} from '../classes/Folder';
import {Space} from '../classes/Space';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {SpaceMetadata} from '../classes/SpaceMetadata';
import { environment } from 'src/environments/environment';
import {User} from '../classes/User';

@Injectable()
export class SpaceService {
  baseUrl: string = environment.apiUrl + 'space/';
  currentSpace: Space;
  currentSpace$: BehaviorSubject<Space> = new BehaviorSubject<Space>(this.currentSpace);

  currentFolder: Folder;

  constructor(private http: HttpClient) {
  }

  loadSpace(spaceId: number, uploaded: boolean = false): Observable<Space> {
    if (spaceId != undefined && (this.currentSpace == undefined || (this.currentSpace.id != spaceId) || uploaded)) {
      this.http.get<Space>(this.baseUrl + spaceId).subscribe(space => {
        this.currentSpace = space;
        this.currentSpace$.next(this.currentSpace);
      });
    }
    return this.currentSpace$;
  }

  createSpace(name: string): Observable<SpaceMetadata> {
    return this.http.post<SpaceMetadata>(this.baseUrl + '?name=' + name, {});
  }

  delete(id: number): Observable<string> {
    let spaceDeletionResult = new BehaviorSubject('');
    // todo disable deleting current space? Or navigate to other space then?
    if (id != this.currentSpace.id) {
      this.http.delete<string>(this.baseUrl + id).subscribe(result => {
        if (result != null) {
          spaceDeletionResult.next(result);
        } else {
          spaceDeletionResult.next('Space was deleted successfully');
        }
      });
    }
    return spaceDeletionResult;
  }

  addUserToCurrentSpace(usermail: string): Observable<User[]> {
    let userSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(undefined);
    this.http.post<User[]>(this.baseUrl + this.currentSpace.id + '/adduser?mail=' + usermail, {}).subscribe(users => {
      userSubject.next(users);
    });
    return userSubject;
  }

  removeUserFromCurrentSpace(userId: number): Observable<User[]> {
    let userSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(undefined);
    this.http.post<User[]>(this.baseUrl + this.currentSpace.id + '/removeuser?id=' + userId, {}).subscribe(users => {
      userSubject.next(users);
    });
    return userSubject;
  }
}
