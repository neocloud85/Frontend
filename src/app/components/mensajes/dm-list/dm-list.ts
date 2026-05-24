import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MensajesService } from '../../../services/mensajes';

@Component({
  selector: 'app-dm-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dm-list.html',
  styleUrl: './dm-list.css'
})
export class DmListComponent {

  private mensajes = inject(MensajesService);
  private router = inject(Router);

  chats = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.mensajes.obtenerChats().subscribe(data => {
      this.chats.set(data);
      this.loading.set(false);
    });
  }

  abrirChat(id: string) {
    this.router.navigate(['/dm', id]);
  }
}
