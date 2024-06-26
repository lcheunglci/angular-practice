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
  defaultQuestion = 'teacher';
  answer = '';
  user: {
    username: '',
    email: '',
    secretQuestion: '',
    answer: '',
    gender: ''
  }
  submitted: false;

  suggestUserName() {
    const suggestUserName = 'Superuser';
    /* this.signupForm.setValue({
      userData: {
        username: suggestUserName,
        email: ''
      },
      secret: 'pet',
      questionAnswer: '',
      gender: 'male'
    })
    */
    this.signupForm.form.patchValue({
      userData: {
        username: suggestUserName
      }
    });
  }

  //onSubmit(form: NgForm) {
  //  console.log(form);
  //}

  onSubmit() {
    console.log(this.signupForm);
    this.submitted = true;
    this.user.username = this.signupForm.value.userData.username;
    this.user.email = this.signupForm.value.userData.email;
    this.user.secretQuestion = this.signupForm.value.secret;
    this.user.answer = this.signupForm.value.questionAnswer;
    this.user.gender = this.signupForm.value.gender;

    this.signupForm.reset();
  }
}
