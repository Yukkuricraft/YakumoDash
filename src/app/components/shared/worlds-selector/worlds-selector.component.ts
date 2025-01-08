import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { BackupsFacade } from "@app/store/backups/backups.facade";
import { Observable } from "rxjs";

export interface Selection {
  name: string;
  selected: boolean;
}

@Component({
  selector: "app-worlds-selector",
  templateUrl: "./worlds-selector.component.html",
  styleUrls: ["./worlds-selector.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class WorldsSelectorComponent implements OnInit, OnChanges {
  @Input() worlds!: string[];
  @Output() onSelectedWorldsChange = new EventEmitter<{ worlds: string[] }>();

  selections: Selection[];
  isSnapshotWorldsListReadyToRender$: Observable<boolean>;

  constructor(private backupsFacade: BackupsFacade) {
    this.selections = [];
    this.isSnapshotWorldsListReadyToRender$ =
      this.backupsFacade.isSnapshotWorldsReadyToRender$();

    this.isSnapshotWorldsListReadyToRender$.subscribe(data => {
      console.log("++");
      console.log(data);
      console.log(this.selections);
    });
  }

  ngOnInit(): void {
    this.initializeSelectionsObjects();
  }

  ngOnChanges(): void {
    this.initializeSelectionsObjects();
  }

  initializeSelectionsObjects() {
    this.selections = [];

    for (let world of this.worlds) {
      this.selections.push({
        name: world,
        selected: false,
      });
    }
  }

  allSelected: boolean = false;

  updateAllSelected() {
    this.allSelected = this.selections.every(t => t.selected);

    this.emitWorlds();
  }

  someSelected(): boolean {
    if (this.selections == null) {
      return false;
    }
    return (
      this.selections.filter(t => t.selected).length > 0 && !this.allSelected
    );
  }

  selectAll(selected: boolean) {
    this.allSelected = selected;
    if (this.selections == null) {
      return;
    }
    this.selections.forEach(t => (t.selected = selected));

    this.emitWorlds();
  }

  emitWorlds() {
    let d = {
      worlds: this.selections.filter(s => s.selected).map(s => s.name),
    };
    console.log("emitWorlds");
    console.log(d.worlds);
    this.onSelectedWorldsChange.emit({
      worlds: this.selections.filter(s => s.selected).map(s => s.name),
    });
  }
}
