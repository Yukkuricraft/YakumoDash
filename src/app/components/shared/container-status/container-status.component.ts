import { Component, Input, OnInit } from "@angular/core";
import { ContainerDefinition } from "@app/models/container";
import { selectActiveContainerByContainerDef } from "@app/store/root.selectors.containers";
import { Store } from "@ngrx/store";
import { map } from "rxjs";

@Component({
  selector: "app-container-status",
  templateUrl: "./container-status.component.html",
  styleUrls: ["./container-status.component.scss"],
})
export class ContainerStatusComponent {
  @Input() containerDef!: ContainerDefinition;

  maxExtraInfoLevels = 3; // zero up to and not including max
  extraInfoLevel: number = 0;
  get showExtraInfo() {
    return this.extraInfoLevel >= 1;
  }
  get showExtraExtraInfo() {
    return this.extraInfoLevel >= 2;
  }

  toggleExtraContainerStatus() {
    this.extraInfoLevel = (this.extraInfoLevel + 1) % this.maxExtraInfoLevels;
  }

  getExtraContainerToggleText() {
    if (this.extraInfoLevel === 0) {
      return "Show More";
    } else if (this.extraInfoLevel === 1) {
      return "Show MORE";
    } else if (this.extraInfoLevel === this.maxExtraInfoLevels - 1) {
      return "Hide";
    } else {
      throw Error(
        `Got an impossible 'extraInfoLevel' (${this.extraInfoLevel}) greater than max (${this.maxExtraInfoLevels}).`
      );
    }
  }

  constructor(private store: Store) {}

  getActiveContainer$(containerDef: ContainerDefinition) {
    return this.store.select(selectActiveContainerByContainerDef(containerDef));
  }
}
