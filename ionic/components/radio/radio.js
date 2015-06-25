import {ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {View} from 'angular2/src/core/annotations_impl/view';

//import {ControlGroup, ControlDirective} from 'angular2/forms'
import {IonicDirective, IonicComponent} from 'ionic/config/component';


@IonicDirective(RadioGroup)
export class RadioGroup {

  static get config() {
    return {
      selector: 'ion-radio-group'
    }
  }

  constructor(
    elementRef: ElementRef//,
    //cd:ControlDirective
  ) {
    this.domElement = elementRef.domElement
    // this.config = RadioGroup.config.invoke(this)
    // this.controlDirective = cd;
    // cd.valueAccessor = this; //ControlDirective should inject CheckboxControlDirective

    this.domElement.classList.add('list');

    this.buttons = [];
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
  register(radioButton) {
    this.buttons.push(radioButton);

    // If we don't have a default value, and this is the
    // first button added, select it
    if(!this.value && this.buttons.length === 1) {
      setTimeout(() => {
        // We need to defer so the control directive can initialize
        this.selected(radioButton);
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
  selected(radioButton) {
    for(let button of this.buttons) {
      button.setActive(false);
    }
    radioButton.setActive(true);

    this.value = radioButton.value;
    // TODO: Better way to do this?
    this.controlDirective._control().updateValue(this.value);
  }
}


@IonicComponent(RadioButton)
@View({
  template: `
    <div class="item-content">

      <div class="item-title">
        <content></content>
      </div>

      <div class="item-media media-radio">
        <icon class="radio-off"></icon>
        <icon class="ion-ios-checkmark-empty radio-on"></icon>
      </div>

    </div>
  `
})
export class RadioButton {

  static get config() {
    return {
      selector: 'ion-radio',
      properties: [
        'value'
      ],
      host: {
        '(^click)': 'buttonClicked($event)'
      }
    }
  }

  constructor(
    @Ancestor() group: RadioGroup,
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement;

    this.domElement.classList.add('item')
    this.domElement.setAttribute('aria-checked', true)

    this.group = group;

    group.register(this);
  }

  setActive(isActive) {
    // TODO: No domElement
    if(isActive) {
      this.domElement.classList.add('active');
      this.domElement.setAttribute('aria-checked', true)
    } else {
      this.domElement.classList.remove('active');
      this.domElement.setAttribute('aria-checked', false)
    }
  }

  buttonClicked(event) {
    this.group.selected(this, event);
    event.preventDefault();
  }

}