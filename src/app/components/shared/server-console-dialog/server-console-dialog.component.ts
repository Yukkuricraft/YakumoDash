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
  HostListener,
} from "@angular/core";
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerType,
} from "@app/models/container";
import { selectActiveContainerByContainerDef } from "@app/store/root/root.selectors.containers";
import { Store } from "@ngrx/store";
import { AttachAddon } from "@xterm/addon-attach";
import { Terminal } from "@xterm/xterm";
import { AuthService } from "@app/services/auth/auth.service";
import { FitAddon } from "@xterm/addon-fit";
import { environment } from "src/environments/environment";
import { DockerService } from "@app/services/docker/docker.service";
import { filter, forkJoin, map, mergeMap, of, switchMap } from "rxjs";
import { DockerContainerActionResponse } from "@app/models/docker";

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
  @ViewChild("myTerminal", { static: true }) terminalDiv!: ElementRef;
  terminal!: Terminal;
  socket: WebSocket | undefined;
  fitAddon: FitAddon | undefined;

  logsLoaded: boolean = false;
  lastLogReceivedTime: number | undefined;
  lastLogReceivedCheckIntervalMs = 250;

  checkLogsLoadedIntervalHandler: ReturnType<typeof setInterval> | undefined;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ServerConsoleDialogComponent, boolean>,
    private authService: AuthService,
    private dockerService: DockerService,
    @Inject(MAT_DIALOG_DATA) public data?: ServerConsoleDialogData
  ) {
    this.fitAddon = new FitAddon();
    this.checkLogsLoadedIntervalHandler = setInterval(
      this.checkLogsLoaded,
      this.lastLogReceivedCheckIntervalMs
    );
  }

  checkLogsLoaded = () => {
    const now = Date.now();

    if (this.lastLogReceivedTime) {
      const timeSinceLastLog = now - this.lastLogReceivedTime;

      if (timeSinceLastLog > this.lastLogReceivedCheckIntervalMs) {
        this.logsLoaded = true;

        clearInterval(this.checkLogsLoadedIntervalHandler);
        this.checkLogsLoadedIntervalHandler = undefined;

        if (this.socket) {
          this.socket.removeEventListener("message", this.onWsMessageReceived);
        }
      }
    }
  };

  onWsMessageReceived = () => {
    if (!this.logsLoaded) {
      this.lastLogReceivedTime = Date.now();
    }
  };

  onWsSocketOpen = () => {
    if (this.socket === undefined) {
      throw Error("Called onWsSocketOpen while this.socket was undefined!");
    }
    const attachAddon = new AttachAddon(this.socket);
    this.terminal.loadAddon(attachAddon);
    this.terminal.open(this.terminalDiv.nativeElement);

    if (this.fitAddon === undefined) {
      throw Error("Called onWsSocketOpen but this.fitAddon was undefined!");
    }
    this.terminal.loadAddon(this.fitAddon);
    this.fitAddon.fit();
  };

  get activeContainer$() {
    return this.store.select(
      selectActiveContainerByContainerDef(
        this.data?.containerDef as ContainerDefinition
      )
    );
  }

  @HostListener("window:resize", ["$event"])
  onResize = () => {
    if (this.fitAddon !== undefined) {
      this.fitAddon.fit();
    }
  };

  ngAfterViewInit() {
    this.terminal = new Terminal({});

    this.activeContainer$
      .pipe(
        filter(
          (
            activeContainer: ActiveContainer | null
          ): activeContainer is ActiveContainer => {
            return activeContainer !== null;
          }
        ),
        mergeMap((activeContainer: ActiveContainer) =>
          forkJoin([
            of(activeContainer),
            this.dockerService.prepareForWsAttach(activeContainer),
          ])
        )
      )
      .subscribe(
        ([activeContainer, containerResponse]: [
          ActiveContainer,
          DockerContainerActionResponse
        ]) => {
          let useLogs;
          if (activeContainer.isVelocityContainer) {
            useLogs = "logs=1&";
          } else {
            useLogs = "";
          }

          // TODO: Should change auth token to a WSS specific auth token with request origin validation because it's not encrypted - traffic snooping could reuse it in theory
          const protocol = environment.USE_AUTH ? "wss" : "ws";
          const wsEndpoint = `${protocol}://${environment.WSS_HOST}/containers/${activeContainer.id}/attach/ws?${useLogs}stdin=1&stdout=1&stderr=1&stream=1&Authorization=${this.authService.accessToken}`;
          this.socket = new WebSocket(wsEndpoint);

          this.socket.addEventListener("message", this.onWsMessageReceived);
          this.socket.addEventListener("open", this.onWsSocketOpen);
        }
      );
  }

  ngOnDestroy() {
    this.dialogRef.close(true);

    if (this.socket !== undefined) {
      console.log("Closing socket");
      this.socket.close();
    }

    this.terminal.clear();

    if (this.checkLogsLoadedIntervalHandler) {
      clearInterval(this.checkLogsLoadedIntervalHandler);
    }
  }
}
