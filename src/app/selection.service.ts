import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class Selectionservice {
dataEmitter = new EventEmitter<string>();

raiseDataEmitterEvent(selection: string) {
this.dataEmitter.emit(selection);
}
}