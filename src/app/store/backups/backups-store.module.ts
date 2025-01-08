import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { BackupsService } from "@app/services/backups/backups.service";
import { BackupsFeatureKey } from "@app/store/backups/feature-key";
import { BackupsReducer } from "@app/store/backups/backups.reducer";
import { backupsFeatureFacades } from "@app/store/backups/backups.facade";
import { backupsFeatureEffects } from "@app/store/backups/backups.effects";

@NgModule({
  declarations: [],
  providers: [BackupsService, ...backupsFeatureFacades],
  imports: [
    CommonModule,
    StoreModule.forFeature(BackupsFeatureKey, BackupsReducer),
    EffectsModule.forFeature(backupsFeatureEffects),
  ],
})
export class BackupsStoreModule {}
