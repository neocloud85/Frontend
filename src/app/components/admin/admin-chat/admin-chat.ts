import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminMensajesService } from '../../../services/admin-mensajes';
import { ToastService } from '../../../services/toast';
import { TranslatePipe } from '../../../pipes/translate-pipe';
import { TranslateService } from '../../../services/translate';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './admin-chat.html',
  styleUrls: ['./admin-chat.css']
})
export class AdminChatComponent {

  private route = inject(ActivatedRoute);
  private mensajesService = inject(AdminMensajesService);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);

  mensajes = signal<any[]>([]);
  loading = signal(true);

  chatId = this.route.snapshot.params['chatId'];

  ngOnInit() {
    this.cargarMensajes();
    console.log("CHAT ID:", this.chatId);

  }

  cargarMensajes() {
    this.loading.set(true);

    this.mensajesService.getMensajes(this.chatId).subscribe({
      next: (data) => {
        this.mensajes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error(this.translate.t('admin.messages.errorLoadChat'));
      }
    });
  }

  borrarMensaje(id: string) {
    this.toast.confirm(this.translate.t('admin.messages.confirmDeleteMessage'))
      .then(result => {
        if (!result.isConfirmed) return;

        this.mensajesService.borrarMensaje(id).subscribe({
          next: () => {
            this.mensajes.update(list => list.filter(m => m.id !== id));
            this.toast.success(this.translate.t('admin.messages.deletedMessage'));
          },
          error: () => {
            this.toast.error(this.translate.t('admin.messages.errorDeleteMessage'));
          }
        });
      });
  }
}
