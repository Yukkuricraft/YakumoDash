import { Component, Input, OnInit } from '@angular/core';
import { ActiveContainer, ContainerDefinition } from "@app/models/container";
import { selectActiveContainerByContainerDef } from '@app/store/root.selectors';
import { Store } from '@ngrx/store';
import { map, Observable } from "rxjs";

@Component({
  selector: 'app-minecraft-containers-table',
  templateUrl: './minecraft-containers-table.component.html',
  styleUrls: ['./minecraft-containers-table.component.scss']
})
export class MinecraftContainersTableComponent {
  @Input() containers$!: Observable<ContainerDefinition[]>;

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

  constructor(
    private store: Store,
  ) { }

}
