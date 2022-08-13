import { Component, Input, OnInit } from '@angular/core';
import { ActiveContainer, ContainerDefinition } from "@app/models/container";
import { Observable } from "rxjs";

@Component({
  selector: 'app-minecraft-containers-table',
  templateUrl: './minecraft-containers-table.component.html',
  styleUrls: ['./minecraft-containers-table.component.scss']
})
export class MinecraftContainersTableComponent {
  @Input() containers$!: Observable<ContainerDefinition[]>;

  constructor() { }

}
