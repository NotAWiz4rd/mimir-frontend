import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {File} from '../classes/File';
import {BehaviorSubject, Observable} from 'rxjs';
import {FolderService} from './folder.service';
import {ClipboardService} from './clipboard.service';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

const KEY = 'YOU, W3ary TRAVELLER, Sh4LL P4ss!';

@Injectable()
export class FileService {
  baseUrl: string = environment.apiUrl + 'artifact/';
  currentFile$: BehaviorSubject<File> = new BehaviorSubject<File>(undefined);

  constructor(private http: HttpClient,
              private folderService: FolderService,
              private userService: UserService) {
  }

  loadFile(id: number) {
    this.http.get<File>(this.baseUrl + id).subscribe(file => {
      this.currentFile$.next(file);
    });
  }

  delete(id: number): Observable<boolean> {
    let fileWasDeleted = new BehaviorSubject(false);
    this.http.delete(this.baseUrl + id).subscribe(() => {
      this.folderService.reloadCurrentFolder();
      fileWasDeleted.next(true);
    });
    return fileWasDeleted;
  }

  download(id: number) {
    /*
      create and submit a virtual form
        <form method=POST action=…download>
          <input type=text name=token>…token…</input>
        </form>
    */
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', this.baseUrl + id + '/download');
    const tokenField = document.createElement('input');
    tokenField.setAttribute('type', 'text');
    tokenField.setAttribute('name', 'token');
    tokenField.value = this.userService.token;
    form.appendChild(tokenField);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  rename(id: number, name: string): Observable<boolean> {
    let fileWasRenamed = new BehaviorSubject(false);
    this.http.post(environment.apiUrl + 'folder/id' + '/rename?name=' + name, {}).subscribe(() => {
      this.folderService.reloadCurrentFolder();
      fileWasRenamed.next(true);
    });
    return fileWasRenamed;
  }

  /**
   * Copies a share link for the given file to the clipboard.
   * @param id The file id
   */
  share(id: number) {
    let link: string = window.location.host + '/file/' + id + '?key=' + btoa(KEY);
    ClipboardService.copyToClipboard(link);
  }
}
