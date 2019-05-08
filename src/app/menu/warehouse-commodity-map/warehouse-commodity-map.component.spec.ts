import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseCommodityMapComponent } from './warehouse-commodity-map.component';

describe('WarehouseCommodityMapComponent', () => {
  let component: WarehouseCommodityMapComponent;
  let fixture: ComponentFixture<WarehouseCommodityMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseCommodityMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseCommodityMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
