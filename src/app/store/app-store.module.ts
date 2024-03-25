import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { RootStoreModule } from "@app/store/root/root-store.module";
import { BackupsStoreModule } from "@app/store/backups/backups-store.module";
import { ProgressBarsStoreModule } from './progress-bars/progress-bars.module';

export const featureStores = [
    RootStoreModule,
    BackupsStoreModule,
    ProgressBarsStoreModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument(),
    ...featureStores,
  ]
})
export class AppStoreModule { }