import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ErrorService} from "./error.service";

@Injectable()
export class UploadService {
  constructor(private http: HttpClient,
              private errorService: ErrorService) {
  }

  public upload(files: Set<File>, folderId: number): { [p: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('parentId', folderId.toString());
      formData.append('name', file.name);
      formData.append('file', file);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', environment.apiUrl + 'artifact', formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          progress.complete();
        }
      }, error => {
        progress.error(error);
        this.errorService.handleError(error, 'upload');
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
