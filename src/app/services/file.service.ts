import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse,} from '@angular/common/http';
import {File} from '../classes/File';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

const FILE_TEST_PATH = '../../../assets/file.json';
const url = 'http://localhost:8000/upload';

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

  public upload(files: Set<File>): { [p: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file.name, 'I don\'t know');

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
}
