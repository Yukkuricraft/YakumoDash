import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinecraftContainersTableComponent } from './minecraft-containers-table.component';

describe('MinecraftContainersTableComponent', () => {
  let component: MinecraftContainersTableComponent;
  let fixture: ComponentFixture<MinecraftContainersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinecraftContainersTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinecraftContainersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
