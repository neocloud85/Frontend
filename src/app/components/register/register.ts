import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);

  errorMsg = signal<string>('');

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Error al registrarse');
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
