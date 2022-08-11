import { Component, Input, OnInit } from '@angular/core';
import { Container } from "@app/models/container";

@Component({
  selector: 'app-container-status-light',
  templateUrl: './container-status-light.component.html',
  styleUrls: ['./container-status-light.component.scss']
})
export class ContainerStatusLightComponent {
  @Input() container!: Container;

  constructor() { }

  status() {
    const status: string = "good";

    return status;
  }

}
