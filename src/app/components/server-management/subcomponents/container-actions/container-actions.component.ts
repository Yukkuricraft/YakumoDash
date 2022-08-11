import { Component, Input, OnInit } from '@angular/core';
import { Container } from "@app/models/container";

@Component({
  selector: 'app-container-actions',
  templateUrl: './container-actions.component.html',
  styleUrls: ['./container-actions.component.scss']
})
export class ContainerActionsComponent  {
  @Input() container!: Container;

  constructor() { }

}
