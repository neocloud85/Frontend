import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmistadService } from '../../services/amistad';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { TranslatePipe } from '../../pipes/translate-pipe';

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
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './buscar-usuarios.html',
  styleUrl: './buscar-usuarios.css',
})
export class BuscarUsuariosComponent {

  private amistad = inject(AmistadService);
  private cdr = inject(ChangeDetectorRef);

  query = '';
  resultados: any[] = [];
  todosUsuarios: any[] = [];
  loading = false;

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        startWith(''), // 🔥 EMITE UN VALOR INICIAL
        debounceTime(250),
        distinctUntilChanged(),
        switchMap(texto => {
          texto = texto.trim();

          if (texto.length === 0) {
            this.resultados = [...this.todosUsuarios];
            return of(null);
          }

          if (texto.length < 2) {
            this.resultados = [];
            return of(null);
          }

          this.loading = true;
          return this.amistad.buscarUsuarios(texto);
        })
      )
      .subscribe((data: any) => {
        if (data && this.query.trim().length >= 2) {
          this.resultados = data;
        }
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 fuerza refresco
      });
  }

  ngOnInit() {
    this.cargarTodosUsuarios();
  }

  cargarTodosUsuarios() {
    this.amistad.getAllUsers().subscribe({
      next: (users) => {
        this.todosUsuarios = users;
        this.resultados = [...users];

        this.cdr.detectChanges(); // 🔥 refresca la vista
        this.search$.next('');    // 🔥 dispara búsqueda inicial
      }
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
          title: 'buscarUsuarios.toastSuccess'
        });

        this.resultados = this.resultados.map(u =>
          u.id === id ? { ...u, pendiente: 1 } : u
        );
      },
      error: () => {
        Toast.fire({
          icon: 'error',
          title: 'buscarUsuarios.toastError'
        });
      }
    });
  }
}
