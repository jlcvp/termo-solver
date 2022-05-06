/* eslint-disable @typescript-eslint/semi */
import { Injectable } from '@angular/core';
import * as dictionaryRaw from '../../assets/dictionary.json';
import { Rule } from '../models/rule';
@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private dictionary: string[] = []
  constructor() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

    for(const letter of alphabet) {
      const entry: string[] = dictionaryRaw.default[letter].map((word: string) => {
        let sanitizedWord = word.toLocaleLowerCase(['pt-BR', 'pt']);
        sanitizedWord = sanitizedWord.replace(/á/gi, 'a');
        sanitizedWord = sanitizedWord.replace(/ã/gi, 'a');
        sanitizedWord = sanitizedWord.replace(/â/gi, 'a');
        sanitizedWord = sanitizedWord.replace(/é/gi, 'e');
        sanitizedWord = sanitizedWord.replace(/ê/gi, 'e');
        sanitizedWord = sanitizedWord.replace(/í/gi, 'i');
        sanitizedWord = sanitizedWord.replace(/ó/gi, 'o');
        sanitizedWord = sanitizedWord.replace(/ô/gi, 'o');
        sanitizedWord = sanitizedWord.replace(/õ/gi, 'o');
        sanitizedWord = sanitizedWord.replace(/ú/gi, 'u');
        sanitizedWord = sanitizedWord.replace(/ü/gi, 'u');
        sanitizedWord = sanitizedWord.replace(/ç/gi, 'c');

        return sanitizedWord;
      })

      const uniqueWords = [...new Set(entry)]

      this.dictionary.push(...uniqueWords)
    }
  }

  public getNextSuggestions(rules: Rule[], maxResults: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let availableWords = this.dictionary
      for(const rule of rules) {
        if(rule.includes){
          availableWords = availableWords.filter((word: string) => {
            if(rule.knownPosition) {
              return word.includes(rule.letter) && word[rule.knownPosition] === rule.letter
            } else {
              return word.includes(rule.letter) && word[rule.excludePosition] !== rule.letter
            }
          })
        } else {
          availableWords = availableWords.filter((word: string) => !word.includes(rule.letter))
        }
      }

      // get best words
      const topWords: string[] = this.getTopWords(availableWords, maxResults)

      resolve(topWords)
    });
  }

  private getTopWords(words: string[], count: number): string[] {
    let topWords: { word: string; score: number }[] = []

    words.forEach(word => {
      const score = this.getWordScore(word)
      const index = topWords.findIndex(w => w.score < score)
      if(index >= 0) {
        topWords.splice(index, 0, { word, score })
      } else {
        topWords.push({ word, score })
      }
    });
    console.log({topWords: topWords.slice(0, 50)})
    topWords = topWords.slice(0, count)
    return topWords.map(w => w.word)
  }

  private getWordScore(word: string): number {
    let score = 0
    const charSet = new Set(word.split(''))

    score += charSet.size

    for(const char of charSet) {
      if(char === 'a' || char === 'e' || char === 'o') {
        score += 2
      } else if(char === 'i' || char === 'u') {
        score += 1.5
      } else if(char === 'r' || char === 'l' || char === 's') {
        score += 1
      }
    }
    return score
  }
}
