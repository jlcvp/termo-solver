/* eslint-disable @typescript-eslint/semi */
import { AfterViewInit, Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements AfterViewInit {
  wordRows = []
  currentRow = 0
  currentLetter = 0
  constructor(private toastController: ToastController) {
    this.resetVars()
  }

  ngAfterViewInit() {
    this.registerKeyboardEvents()
  }

  resetVars() {
    this.wordRows = []
    this.currentRow = 0
    this.currentLetter = 0
    for (let i = 0; i < 7; i++) {
      this.wordRows.push({
        word: [' ', ' ', ' ', ' ', ' '],
        rowState: (i === this.currentRow) ? RowState.current : RowState.future,
        validity: [
          Validity.empty,
          Validity.empty,
          Validity.empty,
          Validity.empty,
          Validity.empty
        ]
      })
    }
  }

  getClassNameForValidity(validity: Validity) {
    switch (validity) {
      case Validity.empty:
        return 'empty'
      case Validity.wrong:
        return 'wrong'
      case Validity.correct:
        return 'correct'
      case Validity.inplaceWrong:
        return 'inplacewrong'
    }
  }

  selectLetter(rowIndex: number, letterIndex: number) {
    //set focus
    //document.getElementById(`letter-${rowIndex}-${letterIndex}`).focus()
    this.currentRow = rowIndex
    this.currentLetter = letterIndex
  }

  rotateLetterStatus(rowIndex: number, letterIndex: number) {
    const validity = this.wordRows[rowIndex].validity[letterIndex]
    switch (validity) {
      case Validity.wrong:
        this.wordRows[rowIndex].validity[letterIndex] = Validity.inplaceWrong
        break
      case Validity.inplaceWrong:
        this.wordRows[rowIndex].validity[letterIndex] = Validity.correct
        break
      case Validity.correct:
        this.wordRows[rowIndex].validity[letterIndex] = Validity.wrong
        break
      default:
        break
    }
  }

  isCurrentRow(row) {
    return row.rowState === RowState.current
  }

  isPastRow(row) {
    return row.rowState === RowState.past
  }

  isFutureRow(row) {
    return row.rowState === RowState.future
  }

  private handleBackspace() {
    if (this.currentLetter > 0) {
      this.currentLetter--
      this.wordRows[this.currentRow].word[this.currentLetter] = ' '
      this.wordRows[this.currentRow].validity[this.currentLetter] = Validity.empty
    }
  }

  private handleEnter() {
    const isRowComplete = this.wordRows[this.currentRow].word.every(letter => letter !== ' ')
    if (isRowComplete) {
      this.wordRows[this.currentRow].rowState = RowState.past
      this.wordRows[this.currentRow].validity = [ Validity.wrong, Validity.wrong, Validity.wrong, Validity.wrong, Validity.wrong ]
      this.currentRow++
      this.wordRows[this.currentRow].rowState = RowState.current
      this.currentLetter = 0
      if (this.currentRow === 7) {
        //handle finish
      }
    }
  }

  private handleLetter(letter: string) {
    if (this.currentLetter < 5) {
      this.wordRows[this.currentRow].word[this.currentLetter] = letter
      this.currentLetter++
    }
  }

  private registerKeyboardEvents() {
    document.addEventListener('keydown', (event) => {
      console.log({ event })
      if (event.key === 'Backspace') {
        this.handleBackspace()
      } else if (event.key === 'Enter') {
        this.handleEnter()
      } else if (event.key.toUpperCase().charCodeAt(0) >= 65 && event.key.toUpperCase().charCodeAt(0) <= 90) {
        this.handleLetter(event.key)
      }
    })

    for(let i = 0; i < 7; i++) {
      for(let j = 0; j < 5; j++) {
        const letterId = `letter-${i}-${j}`
        const letterElement = document.getElementById(letterId)
        if (letterElement) {
          letterElement.addEventListener('click', () => {
            this.selectLetter(i, j)

            letterElement.focus()
            this.toastController.create({
              message: `Selected ${letterId}`,
            }).then(toast => toast.present())

          })
        }
      }
    }
  }
}

export enum Validity {
  empty = 'empty',
  wrong = 'wrong',
  inplaceWrong = 'inplaceWrong',
  correct = 'correct',
}

export enum RowState {
  current = 'current',
  past = 'past',
  future = 'future'
}
