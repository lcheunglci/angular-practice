import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.scss'],
})
export class LoginFormComponent {
  username = signal('');
  password = signal('');
  error = signal('');

  // Output event definition
  @Output()
  loginSubmit = new EventEmitter<{ username: string; password: string }>();

  handleSubmit() {
    const user = this.username();
    const pass = this.password();

    // 1. **Client-side Validation**
    if (user.length < 5) {
      this.error.set('Username must be at least 5 characters.');
      return;
    }
    if (pass.length < 8) {
      this.error.set('Password must be at least 8 characters.');
      return;
    }

    // Clear error and emit event on success
    this.error.set('');

    // 2. **Emit Event on Success**
    this.loginSubmit.emit({
      username: user,
      password: pass,
    });
  }
}
