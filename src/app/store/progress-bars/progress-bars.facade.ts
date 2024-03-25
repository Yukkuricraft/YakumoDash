import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ProgressBarIdentifierAndTimestampProp } from "@app/store/progress-bars/progress-bars.actions";
import { getSortedActiveProgressBars } from "@app/store/progress-bars/progress-bars.selectors";

@Injectable()
export class ProgressBarsFacade {
    constructor(
        private store: Store<any>
    ) {
    }
    public getSortedActiveProgressBars$(): Observable<ProgressBarIdentifierAndTimestampProp[]> {
        return this.store.select(getSortedActiveProgressBars)
    }
}

export const progressBarsFeatureFacades = [
    ProgressBarsFacade,
];