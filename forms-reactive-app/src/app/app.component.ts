import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  genders = ['male', 'female'];
  @ViewChild('f') signupForm: NgForm;

  // onSubmit(form: NgForm) {
  //    console.log(form);
  //  }

  onSubmit() {

  }
}