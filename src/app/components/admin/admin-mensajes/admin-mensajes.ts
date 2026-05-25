import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminMensajesService } from '../../../services/admin-mensajes';
import { ToastService } from '../../../services/toast';
import { TranslatePipe } from '../../../pipes/translate-pipe';
import { TranslateService } from '../../../services/translate';

@Component({
  selector: 'app-admin-mensajes',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './admin-mensajes.html',
  styleUrls: ['./admin-mensajes.css']
})
export class AdminMensajesComponent {

  private mensajesService = inject(AdminMensajesService);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);

  chats = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.cargarChats();
  }

  cargarChats() {
    this.loading.set(true);

    this.mensajesService.getChats().subscribe({
      next: (data) => {
        this.chats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error(this.translate.t('admin.messages.errorLoad'));
      }
    });
  }

  borrarChat(id: string) {
    this.toast.confirm(this.translate.t('admin.messages.confirmDelete'))
      .then(result => {
        if (!result.isConfirmed) return;

        this.mensajesService.borrarChat(id).subscribe({
          next: () => {
            this.chats.update(list => list.filter(c => c.id !== id));
            this.toast.success(this.translate.t('admin.messages.deleted'));
          },
          error: () => {
            this.toast.error(this.translate.t('admin.messages.errorDelete'));
          }
        });
      });
  }
}
