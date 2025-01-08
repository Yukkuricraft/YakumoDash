import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  ProgressBarsFeatureState,
  ProgressBarsState,
} from "@app/store/progress-bars/progress-bars.reducer";
import { ProgressBarsFeatureKey } from "@app/store/progress-bars/feature-key";
import { ProgressBarIdentifierAndTimestampProp } from "./progress-bars.actions";

const getProgressBarsState = createFeatureSelector<ProgressBarsFeatureState>(
  ProgressBarsFeatureKey
);

export const getActiveProgressBars = createSelector(
  getProgressBarsState,
  (state: ProgressBarsFeatureState) => state.progressBars
);

export const getSortedActiveProgressBars = createSelector(
  getActiveProgressBars,
  (progressBars: ProgressBarsState) => {
    let data: ProgressBarIdentifierAndTimestampProp[] = Object.entries(
      progressBars
    ).map(([identifier, timestamp]: [string, Date]) => {
      return { identifier, timestamp };
    });
    data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return data;
  }
);
