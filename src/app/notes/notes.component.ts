import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
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
import { Selectionservice } from '../selection.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
@Injectable()
export class NotesComponent implements OnInit {
  notes$: Observable<any>; // Observable is a variable that updates. Any could also be String, Number etc. but as it is a JSON we use "any". The $ is a mark to identify variables that update
  notes: Array<any>;
  archivedNotes = [];
  noteheadline = '';
  notetext = '';
  selection: string = 'main';
  

  @ViewChild('closeicon') closeicon: ElementRef<HTMLElement>;

  constructor(public readonly firestore: Firestore, private selectionservice: Selectionservice) {

    this.loadNotes();

    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('overflowhidden');
  }

  ngOnInit(): void {
    this.selectionservice.dataEmitter.subscribe((sidebarSelection) => {
this.selection = sidebarSelection;
    }

    )
  }

  loadNotes() {
    const itemCollection = collection(this.firestore, 'notes');
    this.notes$ = collectionData(itemCollection);

    this.notes$.subscribe((newNotes) => {
      console.log('notes$ are:', newNotes);
      this.loadArchivedNotes(newNotes);

      this.notes = newNotes;
    });
  }

  loadArchivedNotes(newNotes: any) {
    for (let i = 0; i < newNotes.length; i++) {
      const note = newNotes[i];

      if (note.archived) {
        console.log(note);
        this.archivedNotes.push(note);
        console.log(this.archivedNotes);
      }
    }
  }

  addNote() {
    const itemCollection = collection(this.firestore, 'notes');
    const itemID = 'note' + JSON.stringify(this.notes.length);
    const note = {
      archived: false,
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
      deleted: false,
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
