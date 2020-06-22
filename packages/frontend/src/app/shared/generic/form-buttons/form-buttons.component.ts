import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-buttons',
  templateUrl: './form-buttons.component.html',
  styleUrls: [ './form-buttons.component.scss' ]
})
export class FormButtonsComponent {
  @Input() displayDelete = true;
  @Input() disableSave: boolean;
  @Output() saveEvent = new EventEmitter<boolean>();
  @Output() deleteEvent = new EventEmitter<boolean>();

  save() {
    this.saveEvent.emit(true);
  }

  delete() {
    this.deleteEvent.emit(true);
  }
}
