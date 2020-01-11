import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {File} from '../classes/File';
import {BehaviorSubject, Observable} from 'rxjs';
import {FolderService} from './folder.service';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {Comment} from '../classes/Comment';

@Injectable()
export class FileService {
  artifactBaseUrl: string = environment.apiUrl + 'artifact/';
  commentBaseUrl: string = environment.apiUrl + 'comments';
  currentFile$: BehaviorSubject<File> = new BehaviorSubject<File>(undefined);

  constructor(private http: HttpClient,
              private router: Router,
              private folderService: FolderService) {
  }

  loadFile(id: number) {
    this.http.get<File>(this.artifactBaseUrl + id).subscribe(
      file => {
        this.currentFile$.next(file);
      },
      error => this.handleError(error)
    );
  }

  delete(id: number): Observable<boolean> {
    let fileWasDeleted = new BehaviorSubject(false);
    this.http.delete(this.artifactBaseUrl + id).subscribe(() => {
      this.folderService.reloadCurrentFolder();
      fileWasDeleted.next(true);
    });
    return fileWasDeleted;
  }

  async download(id: number) {
    const response = await this.http.get<{ token: string }>(environment.apiUrl + 'artifact/download/' + id).toPromise();
    const downloadToken = response.token;
    window.open(environment.apiUrl + 'artifact/' + id + '/download?token=' + downloadToken);
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
  async getShareLink(id: number) {
    const shareToken = await this.http.get<{ token: string }>(this.artifactBaseUrl + 'share/' + id).toPromise();
    return window.location.host + '/file/' + id + '?token=' + shareToken.token;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 403) {
      this.router.navigateByUrl('no-access');
    } else {
      console.error(error);
    }
  }

  addComment(fileId: number, text: string): Observable<Comment> {
    let commentDto = {artifactId: fileId, text: text};
    return this.http.post<Comment>(this.commentBaseUrl, commentDto);
  }

  getComments(fileId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentBaseUrl + '?artifactId=' + fileId);
  }

  async deleteComment(commentId: number) {
    await this.http.delete(this.commentBaseUrl + '/' + commentId).toPromise();
  }
}
