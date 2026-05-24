import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { MensajesService } from '../../../services/mensajes';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-dm-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dm-chat.html',
  styleUrl: './dm-chat.css'
})
export class DmChatComponent {

  private mensajesService = inject(MensajesService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  mensajes = signal<any[]>([]);
  nuevoMensaje = signal('');
  user = this.auth.getUserFromToken();

  otroId = this.route.snapshot.params['id'];

  ngOnInit() {
    this.cargarConversacion();
  }

  cargarConversacion() {
    this.mensajesService.obtenerConversacion(this.otroId).subscribe(data => {
      this.mensajes.set(data);
    });
  }

  enviar() {
    if (!this.nuevoMensaje().trim()) return;

    this.mensajesService.enviarMensaje({
      destinatario_id: this.otroId,
      contenido: this.nuevoMensaje()
    }).subscribe(() => {
      this.nuevoMensaje.set('');
      this.cargarConversacion();
    });
  }
}
