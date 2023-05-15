import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  setDoc,
  getDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
  notes$: Observable<any>; // Observable is a variable that updates. Any could also be String, Number etc. but as it is a JSON we use "any". The $ is a mark to identify variables that update
  notes: Array<any>;
  noteheadline = '';
  notetext = '';

  @ViewChild('closeicon') closeicon: ElementRef<HTMLElement>;
  @ViewChild('editnote') editnote: ElementRef<HTMLElement>;
  
  constructor(private readonly firestore: Firestore) {
    this.load();
  }

  load() {
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
    const note = {
      title: this.noteheadline,
      description: this.notetext,
      id: itemID,
      state: 0,
      deleted: false,
    };
    setDoc(doc(itemCollection, itemID), note);
    this.clearInput();
    this.clickClose();
  }

  clickClose() {
    let el: HTMLElement = this.closeicon.nativeElement;
    el.click();
  }

  async moveToTrash(itemID: string) {
    const noteRef = doc(this.firestore, 'notes', itemID);
    await updateDoc(noteRef, {
      deleted: true,
    });
  }

  async renderEditForm(itemID: string) {
    const noteRef = doc(this.firestore, 'notes', itemID);
    const noteDoc = await getDoc(noteRef);
    const note = noteDoc.data();
    const title = note['title'];
    const description = note['description'];

    this.loadNoteTexts(title, description);

    this.openEditForm();
    
  }

  async deleteNote(itemID: string) {
    const note = doc(this.firestore, `notes`, itemID);
    await deleteDoc(note);
  }

  clearInput() {
    this.notetext = '';
    this.noteheadline = '';
  }

  loadNoteTexts(title: string, description: string) {
    this.noteheadline = title;
    this.notetext = description;
  }

  openEditForm() {
    let el: HTMLElement = this.editnote.nativeElement;
    el.click();
  }
}
