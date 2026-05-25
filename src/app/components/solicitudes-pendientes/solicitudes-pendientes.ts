import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmistadService } from '../../services/amistad';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { TranslateService } from '../../services/translate';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: '#1e1e1e',
  color: '#fff'
});

@Component({
  selector: 'app-solicitudes-pendientes',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './solicitudes-pendientes.html',
  styleUrls: ['./solicitudes-pendientes.css']
})
export class SolicitudesPendientesComponent {

  private amistad = inject(AmistadService);
  private translate = inject(TranslateService); // 🔥 correcto

  solicitudes = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.loading.set(true);

    this.amistad.getSolicitudesPendientes().subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.amistad.solicitudesCount.set(data.length);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  aceptar(id: number) {
    this.amistad.aceptarSolicitud(id).subscribe({
      next: () => {
        this.solicitudes.update(list => {
          const updated = list.filter(s => s.id !== id);
          this.amistad.solicitudesCount.set(updated.length);
          return updated;
        });

        Toast.fire({
          icon: 'success',
          title: this.translate.t('solicitudes.accepted') // 🔥 ahora sí funciona
        });
      }
    });
  }

  rechazar(id: number) {
    this.amistad.rechazarSolicitud(id).subscribe({
      next: () => {
        this.solicitudes.update(list => {
          const updated = list.filter(s => s.id !== id);
          this.amistad.solicitudesCount.set(updated.length);
          return updated;
        });

        Toast.fire({
          icon: 'info',
          title: this.translate.t('solicitudes.rejected') // 🔥 funciona
        });
      }
    });
  }
}
