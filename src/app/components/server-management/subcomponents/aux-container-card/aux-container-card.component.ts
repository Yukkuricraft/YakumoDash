import { Component, Input, OnInit } from '@angular/core';
import { Container } from "@app/models/container";
import { ContainerActionsComponent } from "@app/components/server-management/subcomponents/container-actions/container-actions.component";

@Component({
  selector: 'app-aux-container-card',
  templateUrl: './aux-container-card.component.html',
  styleUrls: ['./aux-container-card.component.scss']
})
export class AuxContainerCardComponent {
  @Input() container!: Container;

  constructor() {
  }

}
