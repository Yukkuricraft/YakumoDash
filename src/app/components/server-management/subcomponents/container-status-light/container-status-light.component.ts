import { Component, Input, OnInit } from '@angular/core';
import { ActiveContainer, ContainerDefinition, DockerContainerState, StateMapping } from "@app/models/container";
import _ from "lodash";

@Component({
  selector: 'app-container-status-light',
  templateUrl: './container-status-light.component.html',
  styleUrls: ['./container-status-light.component.scss']
})
export class ContainerStatusLightComponent {
  @Input() container!: ActiveContainer | ContainerDefinition;

  constructor() { }

  state(): string {
    return this.container.getContainerState();
  }

  stateDescription(): string {
    return StateMapping[this.container.getContainerState()].desc;
  }
}
