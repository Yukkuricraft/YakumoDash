import { Component, Input, OnInit } from '@angular/core';
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerStates,
  DockerContainerState,
  StateMapping
} from "@app/models/container";
import _ from "lodash";
import { selectActiveContainerByContainerDef } from "@app/store/root.selectors";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-container-status-light',
  templateUrl: './container-status-light.component.html',
  styleUrls: ['./container-status-light.component.scss']
})
export class ContainerStatusLightComponent implements OnInit {
  @Input() containerDef!: ContainerDefinition;
  container: ActiveContainer | null = null;

  constructor(private store: Store) {

  }

  ngOnInit() {
    this.store.select(selectActiveContainerByContainerDef(this.containerDef)).subscribe(
      (container) => {
        this.container = container;
      })
  }

  state(): string {
    return this.container ? this.container.getContainerState() : ContainerStates.Down;
  }

  stateDescription(): string {
    return StateMapping[this.state()].desc;
  }
}
