import { Component } from '@angular/core';
import { Firestore, collectionData, collection, setDoc, doc } from '@angular/fire/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {
  notes$: Observable<any>; // Observable is a variable that updates. Any could also be String, Number etc. but as it is a JSON we use "any". The $ is a mark to identify variables that update
  // firestore: Firestore = inject(Firestore); // with this we import Firestore
  notes: Array<any>;
  notetext = '';

  constructor(private readonly firestore: Firestore) {
    const itemCollection = collection(this.firestore, 'notes');
    this.notes$ = collectionData(itemCollection);

    this.notes$.subscribe((newNotes) => {
      console.log('Notizen sind:', newNotes);
      this.notes = newNotes;
    });
  }

  addNote() {
    const itemCollection = collection(this.firestore, 'notes');
    const itemID = 'note' + JSON.stringify(this.notes.length);
    const note = {title: this.notetext, description: '', id: itemID};
    setDoc(doc(itemCollection, itemID), note);
    this.clearInput();
  }

  async deleteNote(id: string) {  
    const note = doc(this.firestore, `notes`, `${id}`)
    await deleteDoc(note);
  }

  clearInput() {
    this.notetext = '';
  }
}


