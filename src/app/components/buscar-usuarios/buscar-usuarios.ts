import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmistadService } from '../../services/amistad';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
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
  templateUrl: './buscar-usuarios.html'
})
export class BuscarUsuariosComponent {

  private amistad = inject(AmistadService);

  query = '';
  resultados: any[] = [];
  todosUsuarios: any[] = [];
  loading = false;

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap(texto => {
          texto = texto.trim();

          if (texto.length === 0) {
            this.resultados = [...this.todosUsuarios];
            this.loading = false;
            return of(null); // <-- no pisa resultados
          }


          if (texto.length < 2) {
            this.resultados = [];
            return of([]);
          }

          this.loading = true;
          return this.amistad.buscarUsuarios(texto);
        })
      )
      .subscribe((data: any) => {
        if (data && this.query.trim().length >= 2) {
          this.resultados = data || [];
        }
        this.loading = false;
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
          title: 'buscarUsuarios.toastSuccess' // opcional si luego lo pasas por translate
        });
      },
      error: () => {
        Toast.fire({
          icon: 'error',
          title: 'buscarUsuarios.toastError' // idem
        });
      }
    });
  }
}
