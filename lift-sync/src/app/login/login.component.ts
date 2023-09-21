import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private userService: UserService) {}

  onLogIn(): void {
    const data = {
      username: this.username,
      password: this.password,
    };

    this.userService.loginUser(data).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      error: (error) => console.log(error),
    });
  }

  onSignUp() {
    console.log('sign-up clicked');
    this.router.navigate(['/sign-up']);
  }
}
