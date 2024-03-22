import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from "@ngrx/store";
import { EffectsModule} from "@ngrx/effects";

import { RootFeatureKey } from "@app/store/root/feature-key";
import { RootReducer } from "@app/store/root/root.reducer";
import { rootFeatureEffects } from "@app/store/root/root.effects";

@NgModule({
  declarations: [],
  providers: [
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(RootFeatureKey, RootReducer),
    EffectsModule.forFeature(rootFeatureEffects)
  ]
})
export class RootStoreModule { }