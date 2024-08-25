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
import { AttachAddon } from '@xterm/addon-attach';
import { Terminal } from "@xterm/xterm";
import { AuthService } from "@app/services/auth/auth.service";
import { FitAddon } from '@xterm/addon-fit';
import { DockerService } from "@app/services/docker/docker.service";

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
  socket: WebSocket | undefined;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ServerConsoleDialogComponent, boolean>,
    private authService: AuthService,
    private dockerService: DockerService,
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
    console.log("Attaching websocket?")


    this.activeContainer$.subscribe((activeContainer: ActiveContainer | null) => {
      if (activeContainer === null) {
        console.log("Got a null active container object!");
        return;
      }

      const wsEndpoint = `wss://dev.docker.yukkuricraft.net/containers/${activeContainer.id}/attach/ws?stdin=1&stdout=1&stderr=1&stream=1&Authorization=${this.authService.accessToken}`;
      // const wsEndpoint = `wss://dev.docker.yukkuricraft.net/containers/yukkuricraft-mc_service-1/attach/ws?stdin=1&stdout=1&stderr=1&logs=1&stream=1&Authorization=${this.authService.accessToken}`;
      // const wsEndpoint = `wss://dev.docker.yukkuricraft.net/containers/stupefied_jepsen/attach/ws?stdin=1&stdout=1&stderr=1&logs=1&stream=1&Authorization=${this.authService.accessToken}`;
      this.socket = new WebSocket(wsEndpoint);

      const attachAddon = new AttachAddon(this.socket);
      const fitAddon = new FitAddon();

      // Attach the socket to term
      this.terminal.loadAddon(attachAddon);
      this.terminal.loadAddon(fitAddon);
      this.terminal.open(this.terminalDiv.nativeElement);
      fitAddon.fit();

      this.dockerService.resizeTty(activeContainer, this.terminal.rows, this.terminal.cols);
    })
  }


  ngOnDestroy() {
    this.dialogRef.close(true);

    if (this.socket !== undefined) {
      console.log("Closing socket");
      this.socket.close();
    }

    this.terminal.clear();

  }
}
