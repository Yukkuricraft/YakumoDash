import { Component, Input, OnInit } from "@angular/core";
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerStates,
  DockerContainerState,
  StateMapping,
} from "@app/models/container";
import { selectActiveContainerByContainerDef } from "@app/store/root.selectors.containers";
import { Store } from "@ngrx/store";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-container-status-light",
  templateUrl: "./container-status-light.component.html",
  styleUrls: ["./container-status-light.component.scss"],
})
export class ContainerStatusLightComponent implements OnInit {
  @Input() containerDef!: ContainerDefinition;

  container$!: Observable<ActiveContainer | null>;
  state$!: Observable<ContainerStates>;
  stateDescription$!: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.container$ = this.store.select(
      selectActiveContainerByContainerDef(this.containerDef)
    );

    this.state$ = this.container$.pipe(
      map((container: ActiveContainer | null) => {
        if (container === null) {
          return ContainerStates.Down;
        } else {
          return container
            ? container.getContainerState()
            : ContainerStates.Unknown;
        }
      })
    );

    this.stateDescription$ = this.state$.pipe(
      map((state: ContainerStates) => {
        return StateMapping[state].desc;
      })
    );
  }
}
