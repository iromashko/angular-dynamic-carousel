import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CarouselModel } from './models/CarouselModel';
import { gsap } from 'gsap';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('carouselContainer', { static: true })
  carouselContainer: ElementRef<HTMLDivElement>;
  @ViewChild('carousel', { static: true })
  carousel: ElementRef<HTMLDivElement>;
  @Input()
  data: CarouselModel[];

  baseZIndex = 50;
  scaleRatio = 10;
  middleIndex: number;

  isAnimating = false;
  prevSlideFinished = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.initCarousel();
  }

  ngOnInit(): void {}

  initCarousel(): void {
    if (this.carousel && this.carousel.nativeElement) {
      gsap.to(this.carousel.nativeElement.children, {
        duration: 0,
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
    }
    this.middleIndex = Math.ceil(
      this.carousel.nativeElement.childNodes.length / 2
    );
    const midElement = this.carousel.nativeElement.children[
      this.middleIndex - 1
    ];
    gsap.to(midElement, {
      duration: 0,
      zIndex: this.baseZIndex,
      width: '650px',
    });
    this.positionLeftNodes(this.middleIndex);
    this.positionRightNodes(this.middleIndex);
  }

  positionLeftNodes(midIndex: number): void {
    let countingForwards = 0;
    let tempZIndex = 0;
    for (let i = midIndex - 1; i >= 0; i--) {
      tempZIndex -= 1;
      countingForwards++;
      const leftNodes = this.carousel.nativeElement.children[i - 1];
      if (leftNodes) {
        gsap.to(leftNodes, {
          duration: 0,
          zIndex: tempZIndex,
          x: -(80 * countingForwards),
          scale: `0.${this.scaleRatio - countingForwards}`,
        });
      }
    }
  }

  positionRightNodes(midIndex: number): void {
    const carouselLength = this.carousel.nativeElement.children.length;
    let countingForwards = 0;
    let tempZIndex = this.baseZIndex;
    for (let i = midIndex; i < carouselLength; i++) {
      countingForwards++;
      tempZIndex -= 1;
      const rightNodes = this.carousel.nativeElement.children[
        i
      ] as HTMLDivElement;
      if (rightNodes) {
        gsap.to(rightNodes, {
          duration: 0,
          zIndex: tempZIndex,
          x: 80 * countingForwards,
          scale: `0.${this.scaleRatio - countingForwards}`,
        });
      }
    }
  }

  prev(): void {
    //
  }

  next(): void {
    this.isAnimating = true;
    this.prevSlideFinished = false;

    if (this.middleIndex > 1) {
      this.moveLeftSideAlongWithMainElement();
      this.moveRemainingRightSide();
    }
  }

  moveLeftSideAlongWithMainElement(): void {
    for (let i = 0; i <= this.middleIndex; i++) {
      const element = this.carousel.nativeElement.children[i] as HTMLDivElement;
      const prevElement = this.carousel.nativeElement.children[
        i - 1
      ] as HTMLDivElement;
      const currentTranslateXValue = gsap.getProperty(element, 'translateX');
      const currZIndex = gsap.getProperty(element, 'zIndex');
      const currentScale = gsap.getProperty(element, 'scale');

      if (currZIndex === this.baseZIndex) {
        gsap.to(element, {
          duration: 0.3,
          zIndex: typeof currZIndex === 'number' && currZIndex - 1,
          x: 80,
          scale: '0.9',
        });
        gsap.to(prevElement, {
          duration: 0.3,
          zIndex: this.baseZIndex,
        });
        this.middleIndex = i;
      } else {
        gsap.to(element, {
          duration: 0.3,
          zIndex: typeof currZIndex === 'number' && currZIndex + 1,
          x:
            typeof currentTranslateXValue === 'number' &&
            currentTranslateXValue + 80,
          scale:
            typeof currentScale === 'number' &&
            parseFloat((currentScale + 0.1).toFixed(1)),
        });
      }
    }
  }

  moveRemainingRightSide(): void {
    const length = this.carousel.nativeElement.children.length;
    for (let i = this.middleIndex; i < length; i++) {
      const element = this.carousel.nativeElement.children[i] as HTMLDivElement;
      const currentTranslateXValue = gsap.getProperty(element, 'translateX');
      const currZIndex = gsap.getProperty(element, 'zIndex');
      const currentScale = gsap.getProperty(element, 'scale');

      gsap.to(element, {
        duration: 0.3,
        zIndex: typeof currZIndex === 'number' && currZIndex - 1,
        x:
          typeof currentTranslateXValue === 'number' &&
          currentTranslateXValue + 80,
        scale:
          typeof currentScale === 'number' &&
          parseFloat((currentScale - 0.1).toFixed(1)),
        onComplete: () => (this.isAnimating = false),
      });
    }
  }
}
