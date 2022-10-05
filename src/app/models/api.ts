export interface IApiRunnerResponse {
    exitCode: number;
    stderr: string;
    stdout: string;
}

export class ApiRunnerResponse implements IApiRunnerResponse {
    exitCode = -1;
    stderr = "";
    stdout = "";
}