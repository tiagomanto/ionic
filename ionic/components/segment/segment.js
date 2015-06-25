import {Renderer, ElementRef} from 'angular2/angular2'

import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NgControl} from 'angular2/forms';
import {ControlGroup, ControlDirective} from 'angular2/forms'
import {dom} from 'ionic/util';
import {IonicComponent} from 'ionic/config/component'


@IonicComponent(Segment)
@View({
  template: `<div class="ion-segment">
    <content></content>
  </div>
  `,
  directives: [SegmentButton]
})
export class Segment {

  static get config() {
    return {
      selector: 'ion-segment',
      appInjector: [ NgControl ],
      properties: [
        'value'
      ],
      host: {
        '(click)': 'buttonClicked($event)',
        '[value]': 'value'
      }
    }
  }

  constructor(
    ngControl: NgControl,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    console.log('ELEMENT REF INJECT', elementRef, ngControl);
    this.domElement = elementRef.domElement
    //this.config = Segment.config.invoke(this)
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.ngControl = ngControl;
    this.ngControl.valueAccessor = this;

    this.buttons = [];
  }

  onInit() {
    Segment.applyConfig(this);
  }

  /**
   * Much like ngModel, this is called from our valueAccessor for the attached
   * ControlDirective to update the value internally.
   */
  writeValue(value) {
    this.value = value;

    setTimeout(() => {
      this.selectFromValue(value);
    })
  }

  /**
   * Called by child SegmentButtons to bind themselves to
   * the Segment.
   */
  register(segmentButton) {
    this.buttons.push(segmentButton);

    // If we don't have a default value, and this is the
    // first button added, select it
    if(!this.value && this.buttons.length === 1) {
      setTimeout(() => {
        // We need to defer so the control directive can initialize
        this.selected(segmentButton);
      })
    }
  }

  /**
   * Select the button with the given value.
   */
  selectFromValue(value) {
    for(let button of this.buttons) {
      if(button.value === value) {
        this.selected(button);
      }
    }
  }


  /**
   * Indicate a button should be selected.
   */
  selected(segmentButton) {
    console.log('Selecting', segmentButton);
    for(let button of this.buttons) {
      button.setActive(false);
    }
    segmentButton.setActive(true);

    this.value = segmentButton.value;
    // TODO: Better way to do this?
    //this.controlDirective._control().updateValue(this.value);
  }
}


@Directive({
  selector: 'ion-segment-button',
  properties: [
    'value'
  ],
  host: {
    '(click)': 'buttonClicked($event)',
    '[class.active]': 'isActive'
  }
})
export class SegmentButton {
  constructor(
    @Ancestor() segment: Segment,
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement
    this.segment = segment;

    segment.register(this);
  }

  setActive(isActive) {
    this.isActive = isActive;
  }

  buttonClicked(event) {
    this.segment.selected(this, event);
    event.preventDefault();
  }

}