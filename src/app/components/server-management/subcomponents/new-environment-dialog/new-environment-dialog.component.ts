import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-environment-dialog',
  templateUrl: './new-environment-dialog.component.html',
  styleUrls: ['./new-environment-dialog.component.scss']
})
export class NewEnvironmentDialogComponent {

  constructor() { }

  createNewEnv() {
    console.log("Syke")
  }
}
