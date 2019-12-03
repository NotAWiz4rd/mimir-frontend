import {Component, OnInit} from '@angular/core';

// for parallax tilt: https://codepen.io/coder63812/pen/NWPKmNj


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  ngOnInit() {
    const $ = e => document.querySelector(e);
    // tslint:disable-next-line
    new parallaxTiltEffect({
      element: $('.wrap--main'),
    });
  }
}

// tslint:disable-next-line:class-name
class parallaxTiltEffect {
  element: any;
  container: any;
  size: number[];
  w: any;
  h: any;
  mouseOnComponent: boolean;

  constructor({element}) {
    this.element = element;
    this.container = this.element.querySelector('.container');
    this.size = [640, 360];
    [this.w, this.h] = this.size;

    this.mouseOnComponent = false;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleDeviceMotion = this.handleDeviceMotion.bind(this);

    this.defaultStates = this.defaultStates.bind(this);
    this.setProperty = this.setProperty.bind(this);
    this.init = this.init.bind(this);

    this.init();
  }

  skew(offsetX, offsetY) {
    const X = (-(offsetX - (this.w / 2)) / 3) / 3;
    const Y = ((offsetY - (this.h / 2)) / 3) / 3;

    this.setProperty('--rY', X.toFixed(2));
    this.setProperty('--rX', Y.toFixed(2));

    // tslint:disable-next-line:radix
    this.setProperty('--bY', (40 - parseInt((X / 4).toFixed(2))) + '%');
    // tslint:disable-next-line:radix
    this.setProperty('--bX', (25 - parseInt((Y / 4).toFixed(2))) + '%');
  }

  handleMouseMove(event) {
    this.skew(event.offsetX, event.offsetY);
  }

  handleMouseEnter() {
    this.mouseOnComponent = true;
    this.container.classList.add('container--active');
  }

  handleMouseLeave() {
    this.mouseOnComponent = false;
    this.defaultStates();
  }

  handleDeviceMotion(event) {
    if ('accelerationIncludingGravity' in event) {
      const acc = event.accelerationIncludingGravity;
      this.skew(acc.x * 50, -acc.y * 50);
    }
  }

  defaultStates() {
    this.container.classList.remove('container--active');
    this.setProperty('--rY', 0);
    this.setProperty('--rX', 0);
    this.setProperty('--bY', '80%');
    this.setProperty('--bX', '50%');
  }

  setProperty(p, v) {
    return this.container.style.setProperty(p, v);
  }

  init() {
    const isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
    if (isMobile && 'ondevicemotion' in window) {
      window.addEventListener('devicemotion', this.handleDeviceMotion);
    } else {
      this.element.addEventListener('mousemove', this.handleMouseMove);
      this.element.addEventListener('mouseenter', this.handleMouseEnter);
      this.element.addEventListener('mouseleave', this.handleMouseLeave);
    }
  }
}
