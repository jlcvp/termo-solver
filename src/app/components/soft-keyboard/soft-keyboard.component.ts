import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-soft-keyboard',
  templateUrl: './soft-keyboard.component.html',
  styleUrls: ['./soft-keyboard.component.scss'],
})
export class SoftKeyboardComponent implements OnInit {

  @Input()
  disabledKeys: string[]

  @Output()
  keyPressed = new EventEmitter()

  firstRow: string[] = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
  secondRow: string[] = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
  thirdRow: string[] = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

  constructor() { }

  ngOnInit() {}

  onKeyPress(key: string) {
    this.keyPressed.emit(key)
  }
}
