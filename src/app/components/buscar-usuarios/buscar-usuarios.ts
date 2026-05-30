import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
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
  templateUrl: './buscar-usuarios.html',
  styleUrl: './buscar-usuarios.css',
})
export class BuscarUsuariosComponent {

  private amistad = inject(AmistadService);
  private cdr     = inject(ChangeDetectorRef);

  query      = '';
  resultados: any[] = [];
  loading    = false;

  page       = signal(1);
  totalPages = signal(1);
  total      = signal(0);
  readonly limit = 10;

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(texto => {
          texto = texto.trim();
          if (texto.length < 2) {
            this.resultados = [];
            this.total.set(0);
            this.totalPages.set(1);
            this.loading = false;
            this.cdr.detectChanges();
            return of(null);
          }
          this.loading = true;
          // Al escribir nuevo texto siempre volvemos a página 1
          this.page.set(1);
          return this.amistad.buscarUsuarios(texto, 1, this.limit);
        })
      )
      .subscribe((data: any) => {
        if (data) {
          this.resultados  = data.usuarios;
          this.total.set(data.total);
          this.totalPages.set(data.totalPages);
        }
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  ngOnInit() {
    // Carga inicial: todos los usuarios, página 1
    this.buscarPagina(1);
  }

  onInput() {
    this.search$.next(this.query);
  }

  /** Cambia de página manteniendo el texto actual */
  goTo(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.buscarPagina(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  buscarPagina(p: number) {
    this.loading = true;
    this.amistad.buscarUsuarios(this.query.trim(), p, this.limit).subscribe({
      next: (data: any) => {
        this.resultados  = data.usuarios;
        this.total.set(data.total);
        this.totalPages.set(data.totalPages);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  enviarSolicitud(id: string) {
    this.amistad.enviarSolicitud(id).subscribe({
      next: () => {
        Toast.fire({ icon: 'success', title: 'buscarUsuarios.toastSuccess' });
        this.resultados = this.resultados.map(u =>
          u.id === id ? { ...u, pendiente: 1 } : u
        );
      },
      error: () => {
        Toast.fire({ icon: 'error', title: 'buscarUsuarios.toastError' });
      }
    });
  }
}
