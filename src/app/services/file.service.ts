import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {File} from '../classes/File';
import {BehaviorSubject} from 'rxjs';

const FILE_TEST_PATH = '../../../assets/file.json';

@Injectable()
export class FileService {
  currentFile$: BehaviorSubject<File> = new BehaviorSubject<File>(undefined);

  constructor(private http: HttpClient) {
  }

  loadFile(fileId: number) {
    // todo make proper request
    this.http.get<File>(FILE_TEST_PATH).subscribe(file => {
      console.log('loaded file: ' + fileId);
      this.currentFile$.next(file);
    });
  }
}
