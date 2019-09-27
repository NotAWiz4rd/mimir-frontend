import {Component, OnInit} from '@angular/core';
import {Client} from '../../classes/Client';
import {ClientService} from '../../services/client.service';

@Component({
  selector: 'app-test',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  firstname = '';
  lastname = '';

  clients: Client[];

  constructor(private clientService: ClientService) {
  }

  ngOnInit() {
    this.clientService.getClients().subscribe(data => this.clients = data);
  }

  sendClient() {
    const client = new Client();
    client.firstname = this.firstname;
    client.lastname = this.lastname;
    this.clientService.saveClient(client).subscribe(resultClient => this.clients.push(resultClient));
  }

  onKeyFirstname(value: string) {
    this.firstname = value;
  }

  onKeyLastname(value: string) {
    this.lastname = value;
  }
}
