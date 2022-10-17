import { MatDrawer } from "@angular/material/sidenav";
import { selectEnvByEnvString } from "./../../store/root.selectors";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Env } from "@app/models/env";
import { FileTypeBit } from "@app/models/file";
import { FilesService } from "@app/services/files/files.service";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable, of } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-server-editor",
  templateUrl: "./server-editor.component.html",
  styleUrls: ["./server-editor.component.scss"],
})
export class ServerEditorComponent implements OnInit, AfterViewInit {
  @ViewChild("drawer", { static: false }) drawer!: MatDrawer;
  readyToRender$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  subPath$!: Observable<string>;

  env$!: Observable<Env>;
  constructor(
    private filesService: FilesService,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);

      const env = params["env"] ?? null;
      const subPath = params["subPath"] ?? null;
      this.env$ = this.store.select(selectEnvByEnvString(env ?? ""));
      this.subPath$ = of(subPath ?? "");
    });
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    this.readyToRender$.next(true);
    this.route.queryParams.subscribe(params => {
      console.log(params);

      const env = params["env"] ?? null;
      const subPath = params["subPath"] ?? null;
      console.log("Initializing server editor", env, subPath);
      if (env === null || subPath === null) {
        this.drawer.toggle();
      }
    });
  }

  printy() {
    console.log(this.env$);
  }
}
