import { Features } from "@app/store/index";
import { RootState } from "@app/store/root/root.state";

export interface AppState {
  [Features.Root]: RootState;
}
