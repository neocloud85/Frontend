import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  // Idioma guardado o español por defecto
  currentLang = signal(localStorage.getItem('lang') || 'es');

  setLanguage(lang: string) {
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }

  isSpanish() {
    return this.currentLang() === 'es';
  }

  isEnglish() {
    return this.currentLang() === 'en';
  }
}
