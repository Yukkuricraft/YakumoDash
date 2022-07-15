import { SocialUser } from "@abacritt/angularx-social-login";

export interface RootState {
  user: SocialUser | null;
}

export const initialState: RootState = {
  user: null,
}
