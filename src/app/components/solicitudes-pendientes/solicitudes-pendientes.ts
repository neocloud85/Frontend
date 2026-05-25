import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmistadService } from '../../services/amistad';

@Component({
  selector: 'app-solicitudes-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes-pendientes.html',
  styleUrls: ['./solicitudes-pendientes.css']
})
export class SolicitudesPendientesComponent {

  private amistad = inject(AmistadService);

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
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  aceptar(id: number) {
    this.amistad.aceptarSolicitud(id).subscribe(() => {
      this.solicitudes.update(list => {
        const updated = list.filter(s => s.id !== id);
        this.amistad.solicitudesCount.set(updated.length);
        return updated;
      });
    });
  }

  rechazar(id: number) {
    this.amistad.rechazarSolicitud(id).subscribe(() => {
      this.solicitudes.update(list => {
        const updated = list.filter(s => s.id !== id);
        this.amistad.solicitudesCount.set(updated.length);
        return updated;
      });
    });
  }
}
