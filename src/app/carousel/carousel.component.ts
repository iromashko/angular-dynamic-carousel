import { Component, Input, OnInit } from '@angular/core';
import { CarouselModel } from './models/CarouselModel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  @Input() data: CarouselModel[];

  constructor() {}

  ngOnInit(): void {}
}
