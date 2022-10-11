import { Injectable } from "@angular/core";
import { ActiveContainer } from "@app/models/container";
import { Env } from "@app/models/env";
import { Socket, SocketIoConfig } from "ngx-socket-io";

export const config: SocketIoConfig = {
  url: "wss://api2.yukkuricraft.net",
  options: {},
};

@Injectable({
  providedIn: "root",
})
export class SocketioService {
  message$ = this.socket.fromEvent<any>("message");
  event$ = this.socket.fromEvent<string>("event");
  logFromConsole$ = this.socket.fromEvent<string>("log from console");

  constructor(private socket: Socket) {}

  connect(env: Env, container: ActiveContainer) {
    this.socket.emit("connect to console", { env, container });
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
