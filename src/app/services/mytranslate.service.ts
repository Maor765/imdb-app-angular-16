import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  constructor(private http: HttpClient) {}

  translate(text: string, targetLang: string = 'he', sourceLang = 'en') {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        // The response is a nested array, first item contains translations
        // Extract the translated text segments and join them
        const translated = response[0].map((item: any) => item[0]).join('');
        return translated;
      })
    );
  }
}
