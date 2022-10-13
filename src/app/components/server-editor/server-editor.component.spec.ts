import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerEditorComponent } from './server-editor.component';

describe('ServerEditorComponent', () => {
  let component: ServerEditorComponent;
  let fixture: ComponentFixture<ServerEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
