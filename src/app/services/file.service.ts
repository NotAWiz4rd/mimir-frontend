import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {File} from '../classes/File';
import {BehaviorSubject, Observable} from 'rxjs';
import {FolderService} from './folder.service';
import {ClipboardService} from './clipboard.service';

const FILE_PATH = 'https://se.pfuetsch.xyz/artifact/';
const KEY = 'YOU, W3ary TRAVELLER, Sh4LL P4ss!';

@Injectable()
export class FileService {
  currentFile$: BehaviorSubject<File> = new BehaviorSubject<File>(undefined);

  constructor(private http: HttpClient,
              private folderService: FolderService) {
  }

  loadFile(id: number) {
    this.http.get<File>(FILE_PATH + id).subscribe(file => {
      this.currentFile$.next(file);
    });
  }

  delete(id: number): Observable<boolean> {
    const fileWasDeleted = new BehaviorSubject(false);
    this.http.delete(FILE_PATH + id).subscribe(() => {
      this.folderService.reloadCurrentFolder();
      fileWasDeleted.next(true);
    });
    return fileWasDeleted;
  }

  download(id: number) {
    window.open(FILE_PATH + id + '?download');
  }

  rename(id: number, name: string): Observable<boolean> {
    const fileWasRenamed = new BehaviorSubject(false);
    this.http.post(FILE_PATH + 'id' + '/rename?name=' + name, {}).subscribe(() => {
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
    const link: string = window.location.host + '/file/' + id + '?key=' + btoa(KEY);
    ClipboardService.copyToClipboard(link);
  }
}
