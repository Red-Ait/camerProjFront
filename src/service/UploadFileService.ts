import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  apiUrl = 'http://10.0.2.2:8088';
  // apiUrl = 'http://localhost:8088';
    constructor(private http: HttpClient,
                private storage: Storage) { }

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    this.storage.get('uri').then(uri => {
      if (uri !== null) {
        this.apiUrl = uri;
      }
    });
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', this.apiUrl + '/uploadFile', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  allPhotos() {
    this.storage.get('uri').then(uri => {
      if (uri !== null) {
        this.apiUrl = uri;
      }
    });
    return this.http.get( this.apiUrl + '/allPhotos');
  }
}
