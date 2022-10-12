import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SocketioService } from "@app/services/socketio/socketio.service";
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
import { selectActiveContainerByContainerDef } from "@app/store/root.selectors.containers";
import { Store } from "@ngrx/store";
import { map, Subscription } from "rxjs";
import { ITerminalOptions, Terminal } from "xterm";

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

  baseTerminalOptions: ITerminalOptions = {
    fontSize: 12,
    lineHeight: 1.2,
    letterSpacing: 0,
    fontWeight: "400",
    fontFamily: 'Consolas, "Courier New", monospace',
    cursorBlink: false,
    theme: { background: "#263238" },
    scrollback: Number.MAX_SAFE_INTEGER,
  };

  subscriptions: Subscription[] = [];

  maxContentLen = 50;
  contentLen = 0;
  _consoleContent: string[] = [];
  constructor(
    private store: Store,
    private socketioApi: SocketioService,
    public dialogRef: MatDialogRef<ServerConsoleDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data?: ServerConsoleDialogData
  ) {
    socketioApi.connect();

    console.log("DATA FOR SERVER CONSOLE");
    console.log(data);
    socketioApi.connectToConsole(
      data?.env as Env,
      data?.containerDef as ContainerDefinition
    );

    this.subscriptions.push(
      socketioApi.logFromConsole$.subscribe(log => {
        console.log(`GOT LOGLINE FROM CONSOLE: ${log}`);
        if (this.contentLen == this.maxContentLen) {
          this._consoleContent.shift();
        }

        this._consoleContent.push(log);
        this.terminal.writeln(log);

        if (this.contentLen < this.maxContentLen) {
          this.contentLen += 1;
        }
      })
    );
  }

  get activeContainer$() {
    return this.store.select(
      selectActiveContainerByContainerDef(
        this.data?.containerDef as ContainerDefinition
      )
    );
  }

  ngAfterViewInit() {
    this.terminal = new Terminal(this.baseTerminalOptions);
    this.terminal.open(this.terminalDiv.nativeElement);
  }

  get consoleContent() {
    const tmp = this._consoleContent.join("\n");
    return tmp;
  }

  get serverSocketEvent$() {
    return this.socketioApi.event$;
  }

  get logFromConsole$() {
    return this.socketioApi.logFromConsole$;
  }

  button1Clicked() {
    this.socketioApi.message1("aaaaa");
  }

  button2Clicked() {
    this.socketioApi.message2("aaaaa");
  }

  handleConsoleInput(event: KeyboardEvent) {
    console.log(event);
    const keyCode = event.keyCode;
    if (keyCode === 13) {
      // On enter key press
      // - disable the enter-key input into the textarea
      // - send current textarea contents to console backend
      // - clear the textarea
      event.preventDefault();

      const command = this.myTerminalInputDiv.nativeElement.value;
      this.activeContainer$.subscribe(activeContainer => {
        this.socketioApi.execCommandOnServer(
          activeContainer as ActiveContainer,
          command
        );

        this.myTerminalInputDiv.nativeElement.value = "";
      });
    }
  }

  ngOnDestroy() {
    this.dialogRef.close(true);
    this.socketioApi.disconnect();

    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
