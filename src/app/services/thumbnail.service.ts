import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const THUMBNAIL_PATH = '../../../assets/thumbnails/';

@Injectable()
export class ThumbnailService {

  constructor(private http: HttpClient) {
  }

  loadThumbnail(thumbnailId: number): Observable<Blob> {
    // return this.http.get(THUMBNAIL_PATH + '/' + thumbnailId + '.png', {responseType: 'blob'}); todo
    return this.http.get(THUMBNAIL_PATH + 1 + '.png', {responseType: 'blob'});
  }

  createImageFromBlob(image: Blob): any {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      return reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
