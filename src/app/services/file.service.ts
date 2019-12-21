import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {File} from '../classes/File';
import {BehaviorSubject, Observable} from 'rxjs';
import {FolderService} from './folder.service';
import {ClipboardService} from './clipboard.service';
import {environment} from 'src/environments/environment';
import {UserService} from './user.service';
import {Router} from '@angular/router';

@Injectable()
export class FileService {
  baseUrl: string = environment.apiUrl + 'artifact/';
  currentFile$: BehaviorSubject<File> = new BehaviorSubject<File>(undefined);

  constructor(private http: HttpClient,
              private router: Router,
              private folderService: FolderService,
              private userService: UserService) {
  }

  loadFile(id: number) {
    this.http.get<File>(this.baseUrl + id).subscribe(
      file => {
        this.currentFile$.next(file);
      },
      error => this.handleError(error)
    );
  }

  delete(id: number): Observable<boolean> {
    let fileWasDeleted = new BehaviorSubject(false);
    this.http.delete(this.baseUrl + id).subscribe(() => {
      this.folderService.reloadCurrentFolder();
      fileWasDeleted.next(true);
    });
    return fileWasDeleted;
  }

  async download(id: number) {
    const response = await this.http.get<{ token: string }>(environment.apiUrl + 'artifact/download/'+ id).toPromise();
    const downloadToken = response.token;
    window.open(environment.apiUrl + "artifact/" + id + "/download?token=" + downloadToken);
  }

  rename(id: number, name: string): Observable<boolean> {
    let fileWasRenamed = new BehaviorSubject(false);
    this.http.put(environment.apiUrl + 'artifact/' + id + '/?name=' + name, {}).subscribe(() => {
      this.folderService.reloadCurrentFolder();
      fileWasRenamed.next(true);
    });
    return fileWasRenamed;
  }

  /**
   * Copies a share link for the given file to the clipboard.
   * @param id The file id
   */
  async share(id: number) {
    const shareToken = await this.http.get<{ token: string }>(this.baseUrl + 'share/' + id).toPromise();
    const link = window.location.host + '/file/' + id + '?token=' + shareToken.token;
    ClipboardService.copyToClipboard(link);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 403) {
      this.router.navigateByUrl('no-access');
    } else {
      console.error(error);
    }
  }
}
