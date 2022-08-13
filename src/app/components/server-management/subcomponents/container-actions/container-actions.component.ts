import { Component, Input, OnInit } from '@angular/core';
import { ActiveContainer, ContainerDefinition, ContainerStates } from "@app/models/container";

@Component({
  selector: 'app-container-actions',
  templateUrl: './container-actions.component.html',
  styleUrls: ['./container-actions.component.scss']
})
export class ContainerActionsComponent  {
  @Input() container!: ContainerDefinition;

  constructor() { }

  startContainerDisabled() {
    return this.container.getContainerState() === ContainerStates.Up;
  }
  startContainer() {
    console.log("Starting container", this.container)
  }


  stopContainerDisabled() {
    return this.container.getContainerState() === ContainerStates.Down;
  }
  stopContainer() {
    console.log("Stopping container", this.container)
  }
}
