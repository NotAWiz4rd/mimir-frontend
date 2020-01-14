import {Injectable} from '@angular/core';
import {Folder} from '../classes/Folder';
import {Space} from '../classes/Space';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {SpaceMetadata} from '../classes/SpaceMetadata';
import {environment} from 'src/environments/environment';
import {User} from '../classes/User';
import {ErrorService} from "./error.service";

@Injectable()
export class SpaceService {
  baseUrl: string = environment.apiUrl + 'space/';
  currentSpace: Space;
  currentSpace$: BehaviorSubject<Space> = new BehaviorSubject<Space>(this.currentSpace);

  currentFolder: Folder;

  constructor(private http: HttpClient,
              private errorService: ErrorService) {
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
    this.http.delete<string>(this.baseUrl + id + '?force=true').subscribe(result => {
      if (result != null) {
        spaceDeletionResult.next(result);
      } else {
        spaceDeletionResult.next('Space was deleted successfully');
      }
    });
    return spaceDeletionResult;
  }

  async addUserToCurrentSpace(username: string) {
    await this.http.put<string>(this.baseUrl + this.currentSpace.id + '?username=' + username, {}).toPromise();
  }

  async removeUserFromCurrentSpace(userId: number) {
    await this.http.delete<User[]>(this.baseUrl + this.currentSpace.id + '/removeuser?id=' + userId, {}).toPromise();
  }

  getUsersOfCurrentSpace(): Observable<User[]> {
    let usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(undefined);
    this.http.get<User[]>(this.baseUrl + this.currentSpace.id + '/users').subscribe(users => {
        usersSubject.next(users);
      },
      error => usersSubject.error(error));
    return usersSubject;
  }
}
