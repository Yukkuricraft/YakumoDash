import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentsService {

  private basePath: string = 'https://api2.yukkuricraft.net';

  constructor(private http: HttpClient) { }

  listEnvsWithConfigs() {
    return this.http
      .get<string[]>(`${this.basePath}/environments/list-envs-with-configs`)
  }
}
