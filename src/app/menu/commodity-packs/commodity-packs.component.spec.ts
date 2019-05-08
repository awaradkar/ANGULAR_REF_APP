import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityPacksComponent } from './commodity-packs.component';

describe('CommodityPacksComponent', () => {
  let component: CommodityPacksComponent;
  let fixture: ComponentFixture<CommodityPacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityPacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
