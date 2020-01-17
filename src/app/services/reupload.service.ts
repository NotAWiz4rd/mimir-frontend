import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ErrorService} from './error.service';

@Injectable()
export class ReuploadService {
  constructor(private http: HttpClient,
              private errorService: ErrorService) {
  }

  public reupload(data: Blob, filename: string, artifactId: number) {
    const formData: FormData = new FormData();
    formData.append('file', data, filename);

    this.http.put(environment.apiUrl + 'artifact/' + artifactId, formData).subscribe(
      () => {
        // add completion snackbar
      },
      error => this.errorService.handleError(error),
      () => {
      }
    );

  }
}
