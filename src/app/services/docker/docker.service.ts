import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import { lowercaseKeys } from "@app/helpers/case";
import { Env, CreateEnvResponse } from "@app/models/env";
import { DockerEnvActionResponse } from "@app/models/docker";
import { ActiveContainer, ContainerDefinition } from "@app/models/container";

@Injectable({
	providedIn: "root",
})
export class DockerService {
	private basePath: string = "https://api2.yukkuricraft.net/server";

	constructor(private http: HttpClient) {}

	upEnv(env: Env) {
		return this.http
			.get(`${this.basePath}/${env.name}/containers/up`)
			.pipe(
				map((data: any) =>
					DomainConverter.fromDto(DockerEnvActionResponse, data)
				)
			);
	}

	downEnv(env: Env) {
		return this.http
			.get(`${this.basePath}/${env.name}/containers/down`)
			.pipe(
				map((data: any) =>
					DomainConverter.fromDto(DockerEnvActionResponse, data)
				)
			);
	}

	restartEnv(env: Env) {
		return this.http.get(`${this.basePath}/${env.name}/containers/restart`);
	}

	listDefined(env: Env) {
		return this.http
			.get(`${this.basePath}/${env.name}/containers`)
			.pipe(
				map((data: any) =>
					data.map((obj: any) =>
						DomainConverter.fromDto(ContainerDefinition, obj)
					)
				)
			);
	}

	listActive(env: Env) {
		return this.http
			.get(`${this.basePath}/${env.name}/containers/active`)
			.pipe(
				map((data: any) =>
					data.map((obj: any) =>
						DomainConverter.fromDto(ActiveContainer, lowercaseKeys(obj))
					)
				)
			);
	}
}
