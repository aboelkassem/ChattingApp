import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  values: any;

  constructor(private authService: AuthService, private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Home - ChattingApp');
  }

  registerToggle() {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode; // false
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
}
