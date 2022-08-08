import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxContainerCardComponent } from './aux-container-card.component';

describe('AuxContainerCardComponent', () => {
  let component: AuxContainerCardComponent;
  let fixture: ComponentFixture<AuxContainerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxContainerCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuxContainerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
