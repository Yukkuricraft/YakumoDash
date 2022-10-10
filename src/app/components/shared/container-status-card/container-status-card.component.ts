import { Component, Input, OnInit } from "@angular/core";
import { ContainerDefinition, ContainerType } from "@app/models/container";
import { Env } from "@app/models/env";
import { selectActiveContainerByContainerDef } from "@app/store/root.selectors.containers";
import { Store } from "@ngrx/store";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-container-status-card",
  templateUrl: "./container-status-card.component.html",
  styleUrls: ["./container-status-card.component.scss"],
})
export class ContainerStatusCardComponent {
  @Input() env!: Env;
  ContainerType = ContainerType;
  @Input() containerDef!: ContainerDefinition;

  constructor() {}
}
