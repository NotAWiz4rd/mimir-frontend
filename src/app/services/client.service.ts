import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Client} from '../classes/Client';

const CLIENT_URL = 'http://localhost:8080/java-ee-8-starter/resources/client';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class ClientService {
  constructor(private http: HttpClient) {
  }

  saveClient(client: Client): Observable<Client> {
    return this.http.post<Client>(CLIENT_URL, client, httpOptions);
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(CLIENT_URL);
  }
}
