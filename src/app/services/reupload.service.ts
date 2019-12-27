import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';

@Injectable()
export class ReuploadService {
  constructor(private http: HttpClient) {
  }

  public reupload(data: Blob, filename: string, artifactId: number) {
    const formData: FormData = new FormData();
    formData.append('file', data, filename);

    this.http.put(environment.apiUrl + 'artifact/' + artifactId, formData).subscribe(
      val => {
        console.log('successful put', val);
      },
      response => {
        console.log('error in put', response);
      },
      () => {
        console.log('put observable now complete');
      }
    );

  }
}
