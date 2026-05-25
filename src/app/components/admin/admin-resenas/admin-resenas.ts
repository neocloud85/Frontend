import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin';
import { ToastService } from '../../../services/toast';
import { TranslateService } from '../../../services/translate';
import { TranslatePipe } from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-admin-resenas',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './admin-resenas.html',
  styleUrls: ['./admin-resenas.css']
})
export class AdminResenasComponent {

  private admin = inject(AdminService);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);

  resenas = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.loading.set(true);

    this.admin.getResenasAdmin().subscribe({
      next: (data) => {
        this.resenas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error(this.translate.t('admin.reviews.errorLoad'));
      }
    });
  }

  borrar(id: string) {
    this.toast.confirm(this.translate.t('admin.reviews.confirmDelete'))
      .then(result => {
        if (!result.isConfirmed) return;

        this.admin.borrarResena(id).subscribe({
          next: () => {
            this.resenas.update(list => list.filter(r => r.id !== id));
            this.toast.success(this.translate.t('admin.reviews.deleted'));
          },
          error: () => {
            this.toast.error(this.translate.t('admin.reviews.errorDelete'));
          }
        });
      });
  }
}
