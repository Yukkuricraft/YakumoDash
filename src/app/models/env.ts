
export interface IEnv {
  name: string;
  alias: string;

  type: string;
  num: number | null;

  formatted: string;
}

export class Env implements IEnv{
  name = "";
  alias = "";

  type = "";
  num: number | null = null;

  formatted = "";

  getFormattedLabel() { return `${this.formatted} (${this.alias})`; }
}
