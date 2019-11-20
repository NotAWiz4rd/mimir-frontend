import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

const TEST_SERVER_URL = 'https://se.pfuetsch.xyz//artifact';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) {

  }

  public upload(files: Set<File>, folderId: number): { [p: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('parentId', folderId.toString());
      const nameArr = file.name.split('.');
      let fileName = '';
      for(let i = 0; i<nameArr.length-1; i++){
        fileName += nameArr[i];
      }
      formData.append('name', fileName);
      formData.append('file', file);
      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', TEST_SERVER_URL, formData, {
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
