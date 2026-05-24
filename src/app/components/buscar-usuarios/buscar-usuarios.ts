import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmistadService } from '../../services/amistad';
import { Subject, debounceTime, distinctUntilChanged, switchMap , of } from 'rxjs';
import Swal from 'sweetalert2';

// 🔥 Toast global para este componente
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
  selector: 'app-buscar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-usuarios.html'
})
export class BuscarUsuariosComponent {

  private amistad = inject(AmistadService);

  query = '';
  resultados: any[] = [];
  loading = false;

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(texto => {
          if (texto.trim().length < 2) {
            this.resultados = [];
            return of([]);
          }

          this.loading = true;
          return this.amistad.buscarUsuarios(texto);
        })
      )
      .subscribe((data: any) => {
        this.resultados = data || [];
        this.loading = false;
      });
  }

  onInput() {
    this.search$.next(this.query);
  }

  enviarSolicitud(id: string) {
    this.amistad.enviarSolicitud(id).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: 'Solicitud enviada'
        });
      },
      error: () => {
        Toast.fire({
          icon: 'error',
          title: 'Error al enviar'
        });
      }
    });
  }
}
