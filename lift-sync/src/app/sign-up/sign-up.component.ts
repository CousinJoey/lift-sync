import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onRegister(): void {
    const newUser = {
      username: this.username,
      password: this.password,
    };

    this.userService.registerUser(newUser).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => console.log(error),
    });
  }
}
