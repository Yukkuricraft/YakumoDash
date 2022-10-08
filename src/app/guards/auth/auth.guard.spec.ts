import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
  it("should create an instance", () => {
    const directive = new AuthGuard();
    expect(directive).toBeTruthy();
  });
});
