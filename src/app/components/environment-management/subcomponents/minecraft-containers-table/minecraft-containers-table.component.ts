import { Component, Input } from "@angular/core";
import { ContainerDefinition } from "@app/models/container";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { Env } from "@app/models/env";

@Component({
  selector: "app-minecraft-containers-table",
  templateUrl: "./minecraft-containers-table.component.html",
  styleUrls: ["./minecraft-containers-table.component.scss"],
})
export class MinecraftContainersTableComponent {
  @Input() env!: Env;
  @Input() containers$!: Observable<ContainerDefinition[]>;
  constructor(private store: Store) {}
}
