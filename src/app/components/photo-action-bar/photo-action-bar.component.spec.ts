import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoActionBarComponent } from './photo-action-bar.component';

describe('PhotoActionBarComponent', () => {
  let component: PhotoActionBarComponent;
  let fixture: ComponentFixture<PhotoActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoActionBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
