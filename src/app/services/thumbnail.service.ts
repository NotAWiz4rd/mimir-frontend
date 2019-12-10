import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable()
export class ThumbnailService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,) {
  }

  public fetchThumbnail(fileId: number) : Observable<string> {
    return this.downloadDataAsBase64(environment.apiUrl + 'thumbnail/' + fileId)
  }


  private downloadDataAsBase64(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      flatMap(blob => {
        return this.blobToBase64(blob);
      })
    );
  }

  private blobToBase64(blob: Blob): Observable<any> {
    const fileReader = new FileReader();
    const observable = new Observable(observer => {
      fileReader.onloadend = () => {
        observer.next(this.sanitizer.bypassSecurityTrustResourceUrl(<string> fileReader.result));
        observer.complete();
      };
    });
    fileReader.readAsDataURL(blob);
    return observable;
  }
}
