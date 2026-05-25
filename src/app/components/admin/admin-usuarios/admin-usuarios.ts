import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin';
import { ToastService } from '../../../services/toast';
import { TranslatePipe } from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslatePipe
  ],
  templateUrl: './admin-usuarios.html',
  styleUrls: ['./admin-usuarios.css']
})
export class AdminUsuariosComponent {

  private admin = inject(AdminService);
  private toast = inject(ToastService);
  private t = inject(TranslatePipe);

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
        this.toast.error(this.t.transform('admin.users.errorLoad'));
      }
    });
  }

  buscar() {
    const q = this.searchTerm().trim();

    if (!q) {
      return this.cargarUsuarios();
    }

    this.admin.buscarUsuarios(q).subscribe({
      next: (res) => this.usuarios.set(res),
      error: () => this.toast.error(this.t.transform('admin.users.errorSearch'))
    });
  }

  borrar(id: string) {
    this.toast.confirm(this.t.transform('admin.users.confirmDelete'))
      .then(result => {
        if (!result.isConfirmed) return;

        this.admin.borrarUsuario(id).subscribe({
          next: () => {
            this.toast.success(this.t.transform('admin.users.deleted'));
            this.cargarUsuarios();
          },
          error: () => this.toast.error(this.t.transform('admin.users.errorDelete'))
        });
      });
  }

  hacerAdmin(id: string) {
    this.admin.hacerAdmin(id).subscribe({
      next: () => {
        this.toast.success(this.t.transform('admin.users.updatedAdmin'));
        this.cargarUsuarios();
      },
      error: () => this.toast.error(this.t.transform('admin.users.errorAdmin'))
    });
  }
}
