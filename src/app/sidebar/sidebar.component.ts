import { Component } from '@angular/core';
import { TwitterAuthProvider } from 'firebase/auth';
import { Selectionservice } from '../selection.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent{

  inputselection: string;

constructor(private selectionservice: Selectionservice) {

}

  setSelection(input: string) {
    this.inputselection = input;
    this.selectionservice.raiseDataEmitterEvent(this.inputselection);
    console.log(this.inputselection);
    
}

}
