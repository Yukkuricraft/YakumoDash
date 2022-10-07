import { Component, Input, OnInit } from '@angular/core';
import { ContainerDefinition } from '@app/models/container';
import { selectActiveContainerByContainerDef } from '@app/store/root.selectors';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

@Component({
  selector: 'app-container-status',
  templateUrl: './container-status.component.html',
  styleUrls: ['./container-status.component.scss']
})
export class ContainerStatusComponent {
  @Input() containerDef!: ContainerDefinition;

  constructor(
    private store: Store,
  ) { }

  getContainerPorts$(containerDef: ContainerDefinition) {
    return this.store.select(selectActiveContainerByContainerDef(containerDef)).pipe(
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(
        (activeContainer) => {
          return activeContainer?.ports ?? [];
        }
      ),
    )
  }

  getContainerStatus$(containerDef: ContainerDefinition) {
    return this.store.select(selectActiveContainerByContainerDef(containerDef)).pipe(
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(
        (activeContainer) => {
          return activeContainer?.status ?? "Unknown";
        }
      ),
    )
  }
}
