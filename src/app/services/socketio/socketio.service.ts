import { selectActiveContainerByContainerDef } from "@app/store/root.selectors.containers";
import { Injectable } from "@angular/core";
import { ActiveContainer, ContainerDefinition } from "@app/models/container";
import { Env } from "@app/models/env";
import { Store } from "@ngrx/store";
import { Socket, SocketIoConfig } from "ngx-socket-io";
import { environment } from "src/environments/environment";

export const config: SocketIoConfig = {
  url: `wss://${environment.API_HOST}`,
  options: {
    autoConnect: false,
  },
};

@Injectable({
  providedIn: "root",
})
export class SocketioService {
  message$ = this.socket.fromEvent<any>("message");
  event$ = this.socket.fromEvent<string>("event");
  logFromConsole$ = this.socket.fromEvent<string>("log from console");

  constructor(private socket: Socket, private store: Store) {}

  connectToConsole(env: Env, containerDef: ContainerDefinition) {
    this.store
      .select(selectActiveContainerByContainerDef(containerDef))
      .subscribe(activeContainer => {
        if (activeContainer === null) {
          throw Error(
            "Tried connecting with ContainerDefinition that didn't have a valid ActiveContainer. Aborting."
          );
        }

        const payload = {
          env: env.name,
          // eslint-disable-next-line camelcase
          world_group_name: activeContainer.getContainerNameLabel(),
        };

        console.log("CONNECTING TO SERVER CONSOLE");
        console.log(payload);
        this.socket.emit("connect to console", payload);
      });
  }

  connect() {
    console.log("EMITTING CONNECT");
    this.socket.connect();
  }

  disconnect() {
    console.log("EMITTING DISCONNECT");
    this.socket.disconnect();
  }

  execCommandOnServer(activeContainer: ActiveContainer, command: string) {
    console.log("SENDING COMMAND TO CONTAINER");
    console.log(activeContainer);
    console.log(command);

    const env = activeContainer.EnvLabel;
    const containerName = activeContainer.getContainerNameShorthand();

    const payload = {
      container_name: containerName,
      command,
    };

    this.socket.emit("exec server command", payload);
  }

  message1(msg: any) {
    console.log(`Emitting msg1: ${msg}`);
    this.socket.emit("message1", msg);
  }

  message2(msg: any) {
    console.log(`Emitting msg2: ${msg}`);
    this.socket.emit("message2", msg);
  }
}
