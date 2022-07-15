import { Features } from "@app/store/index";
import { RootState } from "@app/store/root.state";

export interface AppState {
  [Features.Root]: RootState;
}
