import { FILEPATH_ROOT } from "./subcomponents/nested-file-tree/nested-file-tree.component";
import { selectAvailableEnvs } from "./../../store/root.selectors";
import { MatDrawer } from "@angular/material/sidenav";
import { selectEnvByEnvString } from "./../../store/root.selectors";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Env } from "@app/models/env";
import { FileTypeBit } from "@app/models/file";
import { FilesService } from "@app/services/files/files.service";
import { Store } from "@ngrx/store";
import { BehaviorSubject, map, Observable, of, switchMap, tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { MatButtonToggleChange } from "@angular/material/button-toggle";

export interface ExtraConfigParam {
  value: string;
  formatted: string;
}

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

  _selectedEnv: string = "";
  selectedEnv$: BehaviorSubject<string>;
  _selectedConfigType: string = "";
  selectedConfigType$: BehaviorSubject<string>;
  _selectedExtraConfigParam: string = "";
  selectedExtraConfigParam$: BehaviorSubject<string>;

  extraConfigParams$: BehaviorSubject<ExtraConfigParam[]>;

  env$: BehaviorSubject<Env>;
  subPath$!: BehaviorSubject<string>;
  renderFileTree$: BehaviorSubject<boolean>;

  availableEnvs$: Observable<Env[]>;
  constructor(
    private filesService: FilesService,
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.availableEnvs$ = this.store.select(selectAvailableEnvs);
    this.availableEnvs$.subscribe(console.log);

    this.selectedEnv$ = new BehaviorSubject(this._selectedEnv);
    this.selectedConfigType$ = new BehaviorSubject(this._selectedConfigType);
    this.selectedExtraConfigParam$ = new BehaviorSubject(
      this._selectedExtraConfigParam
    );

    this.extraConfigParams$ = new BehaviorSubject([] as ExtraConfigParam[]);
    this.env$ = new BehaviorSubject(new Env());
    this.renderFileTree$ = new BehaviorSubject(false);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);

      const env = params["env"] ?? null;
      const subPath = params["subPath"] ?? null;

      this.subPath$ = new BehaviorSubject(subPath ?? "");
    });
  }

  ngAfterViewInit() {
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

  onEnvChange(event: MatButtonToggleChange) {
    const envString = event.value;
    this.selectedEnv$.next(envString);

    this.store
      .select(selectEnvByEnvString(envString ?? ""))
      // eslint-disable-next-line ngrx/no-store-subscription
      .subscribe((env: Env) => {
        this.env$.next(env);
      });

    this.updateExtraConfigParams();
  }

  onConfigTypeChange(event: MatButtonToggleChange) {
    const configType = event.value;
    this.selectedConfigType$.next(configType);

    this.updateExtraConfigParams();
  }

  updateExtraConfigParams() {
    const env = this.selectedEnv$.value;
    const configType = this.selectedConfigType$.value;

    const rootPath = "secrets/configs";
    let extraConfigParams: ExtraConfigParam[] = [];
    if (configType === "nginx") {
      console.log("Setting up nginx extraConfigParams");
    } else if (configType === "worlds") {
      console.log("Setting up worlds extraConfigParams");
      const path = `${FILEPATH_ROOT}/${this.selectedEnv$.value}/worlds`;
      console.log(`listFiles'ing on ${path}`);
      this.filesService.listFiles(path).subscribe(data => {
        console.log(`aaa got files for ${path}`);
        for (let fileNode of data.ls) {
          const basename = fileNode.basename;
          extraConfigParams.push({
            value: basename,
            formatted: basename.charAt(0).toUpperCase() + basename.slice(1),
          });
        }
      });
    }
    this.extraConfigParams$.next(extraConfigParams);
  }

  onExtraConfigParamChange(event: MatButtonToggleChange) {
    const extraConfigParam = event.value;
    this.selectedExtraConfigParam$.next(extraConfigParam);

    this.updateFiletree();
  }

  updateFiletree() {
    const subPath = `${this.selectedConfigType$.value}/${this.selectedExtraConfigParam$.value}`;
    this.subPath$.next(subPath);
    this.renderFileTree$.next(true);
  }

  toggleDrawer() {
    this.drawer.toggle();
  }
}
