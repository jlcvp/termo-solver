import { Injectable } from '@angular/core';
import * as dictionary from '../../assets/dictionary.json';
@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  constructor() { }

  public getWords(): string[] {
    return dictionary.default.a;
  }
}
