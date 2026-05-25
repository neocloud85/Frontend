import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AmistadService } from '../../services/amistad';
import { AuthService } from '../../services/auth';
import { LanguageService } from '../../services/language';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class MenuComponent {

  private router = inject(Router);
  private amistad = inject(AmistadService);
  auth = inject(AuthService);

  // Servicio de idioma
  lang = inject(LanguageService);

  // Contador reactivo
  solicitudesCount = this.amistad.solicitudesCount;

  ngOnInit() {
    this.amistad.getSolicitudesPendientes().subscribe();

    console.log("USER FROM TOKEN:", this.auth.getUserFromToken());
    console.log("IS ADMIN:", this.auth.isAdmin());
  }

  changeLang(lang: string) {
    this.lang.setLanguage(lang);
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
