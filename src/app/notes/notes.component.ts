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
  archivedNotes: Array<any>;
  noteheadline = '';
  notetext = '';
  // body;

  @ViewChild('closeicon') closeicon: ElementRef<HTMLElement>;

  constructor(private readonly firestore: Firestore) {
    this.loadNotes();
    this.loadArchivedNotes();

    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('overflowhidden');
  }

  loadNotes() {
    const itemCollection = collection(this.firestore, 'notes');
    this.notes$ = collectionData(itemCollection);

    this.notes$.subscribe((newNotes) => {
      console.log('Notizen sind:', newNotes);
      this.notes = newNotes;
    });
  }

  loadArchivedNotes() {
//     for (let i = 0; i < this.notes.length; i++) {
//       const note = this.notes[i];

//       if (note.archived) {
// console.log('archived', note);

//       }
      
//     }
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
    this.activateScroll();
  }

  async moveToTrash(itemID: string) {
    const noteRef = doc(this.firestore, 'notes', itemID);
    await updateDoc(noteRef, {
      deleted: true,
    });
  }

  async updateNote(itemID: string) {
    const noteRef = doc(this.firestore, 'notes', itemID);

    await updateDoc(noteRef, {
      title: this.noteheadline,
      description: this.notetext,
    });
    this.backToList();
  }

  async archiveNote(itemID: string) {
    const noteRef = doc(this.firestore, 'notes', itemID);
    await updateDoc(noteRef, {
      archived: true,
      deleted: false
    });
  }

  async renderEditForm(itemID: string) {
    const noteRef = doc(this.firestore, 'notes', itemID);
    const noteDoc = await getDoc(noteRef);
    const note = noteDoc.data();
    const title = note['title'];
    const description = note['description'];

    this.openEditForm();
    this.deactivateScroll();
    this.loadNoteTexts(title, description);
  }

  async deleteNote(itemID: string) {
    const note = doc(this.firestore, `notes`, itemID);
    await deleteDoc(note);
  }

  backToList() {
    this.activateScroll();
    this.clearInput();
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
    document.getElementById('editform').classList.remove('d-none');
  }

  deactivateScroll() {
    document.getElementsByTagName('body')[0].classList.add('overflowhidden');
  }

  activateScroll() {
    document.getElementsByTagName('body')[0].classList.remove('overflowhidden');
  }
}
