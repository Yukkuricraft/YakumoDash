import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from "@ngrx/store";
import { EffectsModule} from "@ngrx/effects";

import { ProgressBarsFeatureKey} from "@app/store/progress-bars/feature-key";
import { ProgressBarsReducer } from "@app/store/progress-bars/progress-bars.reducer";
import { progressBarsFeatureFacades } from "@app/store/progress-bars/progress-bars.facade";
import { progressBarsFeatureEffects } from "@app/store/progress-bars/progress-bars.effects";



@NgModule({
  declarations: [],
  providers: [
      ...progressBarsFeatureFacades,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(ProgressBarsFeatureKey, ProgressBarsReducer),
    EffectsModule.forFeature(progressBarsFeatureEffects)
  ]
})
export class ProgressBarsStoreModule { }