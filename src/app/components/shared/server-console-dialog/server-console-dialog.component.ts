import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Env } from "@app/models/env";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
} from "@angular/core";
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerType,
} from "@app/models/container";
import { selectActiveContainerByContainerDef } from "@app/store/root/root.selectors.containers";
import { Store } from "@ngrx/store";
import { map, Subscription } from "rxjs";
import { Terminal } from "@xterm/xterm";

export type ServerConsoleDialogData = {
  env: Env;
  containerDef: ContainerDefinition;
};

@Component({
  selector: "app-server-console-dialog",
  templateUrl: "./server-console-dialog.component.html",
  styleUrls: ["./server-console-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ServerConsoleDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild("myTerminalInput", { static: true })
  myTerminalInputDiv!: ElementRef;
  @ViewChild("myTerminal", { static: true }) terminalDiv!: ElementRef;
  terminal!: Terminal;
  subscriptions: Subscription[] = [];

  maxContentLen = 50;
  contentLen = 0;
  _consoleContent: string[] = [];
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ServerConsoleDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data?: ServerConsoleDialogData
  ) {
  }

  get activeContainer$() {
    return this.store.select(
      selectActiveContainerByContainerDef(
        this.data?.containerDef as ContainerDefinition
      )
    );
  }

  ngAfterViewInit() {
    this.terminal = new Terminal({
    });
    this.terminal.open(this.terminalDiv.nativeElement);
  }

  get consoleContent() {
    const tmp = this._consoleContent.join("\n");
    return tmp;
  }


  ngOnDestroy() {
    this.dialogRef.close(true);

    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
