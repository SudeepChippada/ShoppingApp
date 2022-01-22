import { ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {

  // input is the name of the element.
  // viewchild is used to get access to our native element.
  // This is a reusable textbox.
  @ViewChild('input',{static: true}) input: ElementRef;
  @Input() type = 'text';
  @Input() label: string;

  constructor(@Self() public controlDir: NgControl) { 
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : []; 
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];
    
    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  onChange(event){}

  onTouched() {}
  
  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // The below method is optional
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }

}
