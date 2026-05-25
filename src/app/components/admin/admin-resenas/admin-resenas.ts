import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-admin-resenas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-resenas.html',
  styleUrls: ['./admin-resenas.css']
})
export class AdminResenasComponent {

  private admin = inject(AdminService);
  private toast = inject(ToastService);

  resenas = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.admin.getResenasAdmin().subscribe({
      next: (data) => {
        this.resenas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Error al cargar reseñas');
      }
    });
  }

  borrar(id: string) {
    this.toast.confirm('¿Seguro que quieres borrar esta reseña?')
      .then(result => {
        if (!result.isConfirmed) return;

        this.admin.borrarResena(id).subscribe({
          next: () => {
            this.resenas.update(list => list.filter(r => r.id !== id));
            this.toast.success('Reseña eliminada');
          },
          error: () => {
            this.toast.error('No se pudo borrar la reseña');
          }
        });
      });
  }
}
