import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslateService {

  lang = signal(localStorage.getItem('lang') || 'es');
  dictionary = signal<Record<string, string>>({});

  constructor() {
    this.loadLanguage(this.lang());
  }

  async loadLanguage(lang: string) {
    const data = await fetch(`/assets/i18n/${lang}.json`).then(r => r.json());
    this.dictionary.set(data);
  }

  setLanguage(lang: string) {
    this.lang.set(lang);
    localStorage.setItem('lang', lang);
    this.loadLanguage(lang);
  }

  t(key: string): string {
    return this.dictionary()[key] || key;
  }
}
