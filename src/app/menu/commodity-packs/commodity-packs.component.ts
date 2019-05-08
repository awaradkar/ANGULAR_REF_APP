import { Component, OnInit, Input } from '@angular/core';
import { MenuComponent } from '../menu.component';


@Component({
  selector: 'app-commodity-packs',
  templateUrl: './commodity-packs.component.html',
  styleUrls: ['./commodity-packs.component.scss']
})
export class CommodityPacksComponent implements OnInit {
  @Input() menuComponent: MenuComponent;
  
  constructor() { }

  ngOnInit() {
  }

}
