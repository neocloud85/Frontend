import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { AmistadService } from '../../services/amistad';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class MenuComponent {
  private router = inject(Router);

  private amistad = inject(AmistadService);
  auth = inject(AuthService);

  solicitudesCount = 0;

  ngOnInit() {
    // Contador reactivo de solicitudes
    this.amistad.getSolicitudesCount().subscribe(n => {
      this.solicitudesCount = n;
    });

    // Cargar solicitudes al entrar
    this.amistad.getSolicitudesPendientes().subscribe();
    console.log("USER FROM TOKEN:", this.auth.getUserFromToken());
console.log("IS ADMIN:", this.auth.isAdmin());

  }

  logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/']);
}

  get isLoggedIn() {
  return this.auth.isLoggedIn();
}

get isAdmin() {
  return this.auth.isAdmin();
}
}
