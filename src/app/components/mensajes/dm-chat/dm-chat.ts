import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { MensajesService } from '../../../services/mensajes';
import { AuthService } from '../../../services/auth';
import { TranslatePipe } from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-dm-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './dm-chat.html',
  styleUrl: './dm-chat.css'
})
export class DmChatComponent implements AfterViewChecked {

  private mensajesService = inject(MensajesService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  @ViewChild('scrollArea') scrollArea!: ElementRef;

  mensajes = signal<any[]>([]);
  nuevoMensaje = signal('');
  user = this.auth.getUserFromToken();

  otroId = this.route.snapshot.params['id'];
  nombreOtro = '';

  ngOnInit() {
    this.cargarConversacion();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  cargarConversacion() {
    this.mensajesService.obtenerConversacion(this.otroId).subscribe(data => {
      this.mensajes.set(data);
    });
  }

  enviar() {
    const texto = this.nuevoMensaje().trim();
    if (!texto) return;

    this.mensajesService.enviarMensaje({
      destinatario_id: this.otroId,
      contenido: texto
    }).subscribe(() => {
      this.nuevoMensaje.set('');
      this.cargarConversacion();
    });
  }

  private scrollToBottom() {
    try {
      this.scrollArea.nativeElement.scrollTop =
        this.scrollArea.nativeElement.scrollHeight;
    } catch {}
  }
}
