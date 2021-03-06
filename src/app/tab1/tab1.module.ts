import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { DictionaryService } from '../services/dictionary.service';
import { SoftKeyboardComponent } from '../components/soft-keyboard/soft-keyboard.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
  ],
  providers: [
    DictionaryService
  ],
  declarations: [Tab1Page, SoftKeyboardComponent]
})
export class Tab1PageModule {}
