import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {flatMap} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";


@Injectable()
export class FileDataService {
  private artifactBaseUrl: string = environment.apiUrl + 'artifact/';
  private contentType: string;

  constructor(private http: HttpClient,
              private sanitizer: DomSanitizer) {
  }

  public fetchFile(fileId: number): Observable<string> {
    return this.downloadDataAsBase64(this.artifactBaseUrl + fileId + '/raw');
  }

  private downloadDataAsBase64(url: string): Observable<string> {
    return this.http.get(url, {responseType: 'blob'}).pipe(
      flatMap(blob => {
        this.contentType = blob.type;
        if (this.contentType.includes('image') || this.contentType.includes('video') || this.contentType.includes('pdf')) {
          return this.blobToBase64(blob);
        } else if (this.contentType.includes('text')) {
          return this.blobToString(blob);
        } else {
          return 'notViewable';
        }
      })
    );
  }

  private blobToBase64(blob: Blob): Observable<any> {
    const fileReader = new FileReader();
    const observable = new Observable(observer => {
      fileReader.onloadend = () => {
        observer.next(this.sanitizer.bypassSecurityTrustResourceUrl(<string>fileReader.result));
        observer.complete();
      };
    });
    fileReader.readAsDataURL(blob);
    return observable;
  }

  private blobToString(blob: Blob): Observable<any> {
    const fileReader = new FileReader();
    const observable = new Observable(observer => {
      fileReader.onloadend = () => {
        observer.next(this.sanitizer.bypassSecurityTrustHtml(<string>fileReader.result));
        observer.complete();
      };
    });
    fileReader.readAsText(blob);
    return observable;
  }

  public getContentType(): string {
    return this.contentType;
  }
}
