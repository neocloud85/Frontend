import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../interfaces/usuario.model';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-usuario.html',
  styleUrls: ['./editar-usuario.css']
})
export class EditarUsuarioComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private admin = inject(AdminService);
  private toast = inject(ToastService);

  usuario = signal<Usuario | null>(null);

  formData: Usuario = {
    id: '',
    nombre: '',
    correo: '',
    tipo: '',
    activo: 1
  };

  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.cargarUsuario(id);
  }

  cargarUsuario(id: string) {
    this.admin.getUsuarioById(id).subscribe({
      next: (user) => {
        this.usuario.set(user);

        this.formData = {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          tipo: user.tipo,
          activo: user.activo
        };

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Error al cargar el usuario');
      }
    });
  }

  guardarCambios() {
    if (!this.usuario()) return;

    this.admin.actualizarUsuario(this.usuario()!.id, this.formData).subscribe({
      next: () => {
        this.toast.success('Usuario actualizado correctamente');
        this.router.navigate(['/admin/usuarios']);
      },
      error: () => {
        this.toast.error('No se pudieron guardar los cambios');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
}
