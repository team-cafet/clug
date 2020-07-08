import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum NotifTypes {
  MESSAGE,
  WARNING,
  ERROR
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: [ './notification.component.scss' ]
})
export class NotificationComponent implements OnInit {

  @Input() message: string;
  @Input() type: NotifTypes;

  static openNotification(snackbarInstance: MatSnackBar, message, durationInSeconds, notifType = NotifTypes.MESSAGE) {
    const classToAdd = [ 'snackbar' ];

    switch (notifType) {
      case 0:
        classToAdd.push('snackbar__message');
        break;
      case 1:
        classToAdd.push('snackbar__warning');
        break;
      case 2:
        classToAdd.push('snackbar__error');
        break;
      default:
        break;
    }

    const noticationComponent = snackbarInstance.openFromComponent(NotificationComponent, {
      duration: durationInSeconds * 10000,
      panelClass: classToAdd
    });

    noticationComponent.instance.message = message;
    noticationComponent.instance.type = notifType;
  }

  constructor() { }

  ngOnInit(): void {
    //
  }

}
