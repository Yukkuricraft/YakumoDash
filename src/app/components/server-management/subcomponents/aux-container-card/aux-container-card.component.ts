import { Component, Input, OnInit } from '@angular/core';
import { Container } from "@app/models/container";

@Component({
  selector: 'app-aux-container-card',
  templateUrl: './aux-container-card.component.html',
  styleUrls: ['./aux-container-card.component.scss']
})
export class AuxContainerCardComponent {
  @Input() container!: Container;

  constructor() {
  }

}
