import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilenodeRowComponent } from './filenode-row.component';

describe('FilenodeRowComponent', () => {
  let component: FilenodeRowComponent;
  let fixture: ComponentFixture<FilenodeRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilenodeRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilenodeRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
