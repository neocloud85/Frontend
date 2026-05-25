import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AmistadService } from '../../services/amistad';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-amistades',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
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

    this.loading.set(true);

    forkJoin({
      siguiendo: this.amistad.getSiguiendo(user.id),
      seguidores: this.amistad.getSeguidores(user.id)
    }).subscribe(({ siguiendo, seguidores }) => {
      this.siguiendo.set(siguiendo);
      this.seguidores.set(seguidores);

      this.totalSiguiendo.set(siguiendo.length);
      this.totalSeguidores.set(seguidores.length);

      this.loading.set(false);
    });
  }

  dejarDeSeguir(id: string) {
    this.amistad.unfollow(id).subscribe(() => {
      this.toast.info('amistades.unfollowed');
      this.ngOnInit();
    });
  }

  seguirDeVuelta(id: string) {
    this.amistad.followBack(id).subscribe({
      next: () => {
        this.toast.success('amistades.followedBack');
        this.ngOnInit();
      },
      error: () => this.toast.error('amistades.errorFollowBack')
    });
  }

  abrirChat(id: string) {
    this.router.navigate(['/dm', id]);
  }
}
