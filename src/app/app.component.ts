import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from "@abacritt/angularx-social-login";
import { Store } from "@ngrx/store";
import { sendMessageToMaster } from "@angular/compiler-cli/ngcc/src/execution/cluster/utils";
import { RootActions } from "@app/store/root/root.actions";
import { Observable, switchMap } from "rxjs";
import { AuthService } from "@app/services/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { selectGlobalLoadingBarState } from "./store/root/root.selectors";
import { ProgressBarsFacade } from "./store/progress-bars/progress-bars.facade";
import { ProgressBarIdentifierAndTimestampProp } from "./store/progress-bars/progress-bars.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "main";
  loadingBarActive$!: Observable<boolean>;
  activeProgressBars$!: Observable<ProgressBarIdentifierAndTimestampProp[]>;

  constructor(
    private router: Router,
    private store: Store,
    private ycAuthService: AuthService,
    private authService: SocialAuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private progressBarsFacade: ProgressBarsFacade,
  ) {}

  customIcons = {
    trash: "../assets/icons/trash.svg",
    console: "../assets/icons/code_console.svg",

    // eslint-disable-next-line camelcase
    chevrons_left: "../assets/icons/chevrons_left.svg",
  };

  ngOnInit() {
    for (const [iconName, path] of Object.entries(this.customIcons)) {
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(path)
      );
    }

    // Attempt login on load, not guaranteed to work if auth is expired
    this.store.dispatch(RootActions.initializeApp());

    this.authService.authState
      .pipe(
        switchMap(user => {
          /* eslint-disable-next-line camelcase */
          return this.ycAuthService.login({ id_token: user.idToken });
        })
      )
      .subscribe(loginResp => {
        this.store.dispatch(RootActions.initializeApp());

        if (this.router.url === "/login") {
          // Do we ever want this from a non-login url?
          this.router.navigateByUrl("/");
        }
      });

    this.loadingBarActive$ = this.store.select(selectGlobalLoadingBarState);
    this.activeProgressBars$ = this.progressBarsFacade.getSortedActiveProgressBars$();
  }
}
