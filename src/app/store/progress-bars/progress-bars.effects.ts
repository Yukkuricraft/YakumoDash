import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { ProgressBarsFacade } from "@app/store/progress-bars/progress-bars.facade";


@Injectable()
export class ProgressBarsEffects {

    constructor(
        private actions$: Actions,
        private progressBarsFacade: ProgressBarsFacade,
    ) {
    }

}

export const progressBarsFeatureEffects = [
    ProgressBarsEffects,
];
