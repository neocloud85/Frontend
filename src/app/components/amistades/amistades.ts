import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AmistadService } from '../../services/amistad';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-amistades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amistades.html',
  styleUrl: './amistades.css',
})
export class AmistadesComponent {

  private router = inject(Router);
  private amistad = inject(AmistadService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  siguiendo = signal<any[]>([]);
  seguidores = signal<any[]>([]);
  totalSiguiendo = signal(0);
  totalSeguidores = signal(0);
  loading = signal(true);

  ngOnInit() {
    const user = this.auth.getUserFromToken();

    this.amistad.getSiguiendo(user.id).subscribe(sig => {
      this.siguiendo.set(sig);
      this.totalSiguiendo.set(sig.length);

      this.amistad.getSeguidores(user.id).subscribe(seg => {
        this.seguidores.set(seg);
        this.totalSeguidores.set(seg.length);

        this.loading.set(false);
      });
    });
  }

 dejarDeSeguir(id: string) {
  this.amistad.unfollow(id).subscribe(() => {
    this.toast.info('Has dejado de seguir a este usuario');
    this.ngOnInit(); // recarga los datos
  });
}


seguirDeVuelta(id: string) {
  this.amistad.followBack(id).subscribe({
    next: () => {
      this.toast.success('Ahora sigues a este usuario');
      this.ngOnInit(); // recarga los datos
    },
    error: () => this.toast.error('No se pudo seguir de vuelta')
  });
}


  abrirChat(id: string) {
    this.router.navigate(['/dm', id]);
  }
}
