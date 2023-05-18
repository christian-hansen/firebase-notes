import { Component, Injectable, OnInit } from '@angular/core';
import { Selectionservice } from './selection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Selectionservice]
})

@Injectable()
export class AppComponent implements OnInit {

constructor(private selectionservice: Selectionservice) {

}

ngOnInit(): void {
  
}

}

