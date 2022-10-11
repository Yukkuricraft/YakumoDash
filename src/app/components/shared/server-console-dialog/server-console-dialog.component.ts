import { SocketioService } from "@app/services/socketio/socketio.service";
import { Env } from "@app/models/env";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerType,
} from "@app/models/container";
import { selectActiveContainerByContainerDef } from "@app/store/root.selectors.containers";
import { Store } from "@ngrx/store";
import { map } from "rxjs";
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
export class ServerConsoleDialogComponent implements AfterViewInit {
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

  maxContentLen = 50;
  contentLen = 0;
  _consoleContent: string[] = [];
  constructor(private socketioApi: SocketioService) {
    socketioApi.connect({} as Env, {} as ActiveContainer);

    socketioApi.logFromConsole$.subscribe(log => {
      if (this.contentLen == this.maxContentLen) {
        this._consoleContent.shift();
      }

      this._consoleContent.push(log);
      this.terminal.writeln(log);

      if (this.contentLen < this.maxContentLen) {
        this.contentLen += 1;
      }
    });
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
    console.log("aaaaa");
    this.socketioApi.message1("aaaaa");
  }

  button2Clicked() {
    console.log("aaaaa");
    this.socketioApi.message2("aaaaa");
  }
}
