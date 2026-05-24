import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './admin-usuarios.html',
  styleUrls: ['./admin-usuarios.css']
})
export class AdminUsuariosComponent {

  private admin = inject(AdminService);
  private toast = inject(ToastService);

  usuarios = signal<any[]>([]);
  totalPages = signal(1);
  page = signal(1);
  loading = signal(true);
  searchTerm = signal('');

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading.set(true);
    this.admin.getUsuarios(this.page()).subscribe({
      next: (res) => {
        this.usuarios.set(res.usuarios);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Error al cargar usuarios');
      }
    });
  }

  buscar() {
    const q = this.searchTerm().trim();
    if (!q) return this.cargarUsuarios();

    this.admin.buscarUsuarios(q).subscribe({
      next: (res) => this.usuarios.set(res),
      error: () => this.toast.error('Error al buscar usuarios')
    });
  }

  borrar(id: string) {
    this.toast.confirm('¿Seguro que quieres borrar este usuario?')
      .then(result => {
        if (!result.isConfirmed) return;

        this.admin.borrarUsuario(id).subscribe({
          next: () => {
            this.toast.success('Usuario eliminado');
            this.cargarUsuarios();
          },
          error: () => this.toast.error('No se pudo borrar el usuario')
        });
      });
  }

  hacerAdmin(id: string) {
    this.admin.hacerAdmin(id).subscribe({
      next: () => {
        this.toast.success('Usuario actualizado a administrador');
        this.cargarUsuarios();
      },
      error: () => this.toast.error('No se pudo actualizar el usuario')
    });
  }
}
