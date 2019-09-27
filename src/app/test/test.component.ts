import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

class Client {
  firstname: string;
  lastname: string;
}

const CLIENT_URL = 'http://localhost:8080/java-ee-8-starter/resources/client';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  firstname = '';
  lastname = '';

  clients: Client[];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get<Client[]>(CLIENT_URL).subscribe(data => this.clients = data);
  }

  sendClient() {
    const client = new Client();
    client.firstname = this.firstname;
    client.lastname = this.lastname;
    this.http.post<Client>(CLIENT_URL, client, httpOptions).subscribe(resultClient => this.clients.push(resultClient));
  }

  onKeyFirstname(value: string) {
    this.firstname = value;
  }

  onKeyLastname(value: string) {
    this.lastname = value;
  }
}
