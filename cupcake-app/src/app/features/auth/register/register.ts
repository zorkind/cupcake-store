import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  error = signal('');

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    this.error.set('');

    if (this.password !== this.confirmPassword) {
      this.error.set('As senhas não coincidem.');
      return;
    }

    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.error.set('E-mail já cadastrado.');
          return;
        }

        this.error.set('Não foi possível realizar o cadastro.');
      }
    });
  }
}