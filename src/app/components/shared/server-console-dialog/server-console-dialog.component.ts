import { SocketioService } from "@app/services/socketio/socketio.service";
import { Env } from "@app/models/env";
import { Component, Input } from "@angular/core";
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerType,
} from "@app/models/container";
import { selectActiveContainerByContainerDef } from "@app/store/root.selectors.containers";
import { Store } from "@ngrx/store";
import { map } from "rxjs";

export type ServerConsoleDialogData = {
  env: Env;
  containerDef: ContainerDefinition;
};

@Component({
  selector: "app-server-console-dialog",
  templateUrl: "./server-console-dialog.component.html",
  styleUrls: ["./server-console-dialog.component.scss"],
})
export class ServerConsoleDialogComponent {
  constructor(private socketioApi: SocketioService) {
    socketioApi.connect({} as Env, {} as ActiveContainer);
  }

  get serverSocketEvent$() {
    return this.socketioApi.event$;
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
