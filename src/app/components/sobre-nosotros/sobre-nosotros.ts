import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sobre-nosotros.html',
  styleUrls: ['./sobre-nosotros.css']
})
export class SobreNosotrosComponent {

  // Cambia estas URLs cuando tengas el vídeo y la presentación
  videoUrl = 'https://youtu.be/H40jT9vXxTA';
  presentacionUrl = 'https://canva.link/cvoz0ohy2ordalt';

}
