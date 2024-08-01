import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Provider,
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS } from '@angular/forms';

const DATE_VALUE_PROVIDER: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DateValueAccessorDirective),
  multi: true,
};

@Directive({
  selector:
    'input([type=date])[formControlName],input([type=date])[formControl],input([type=date])[ngModel]',
  providers: [DATE_VALUE_PROVIDER],
})
export class DateValueAccessorDirective implements ControlValueAccessor {
  constructor(private element: ElementRef) {}

  @HostListener('input', ['$event.target.valueAsDate'])
  private onChange!: Function;

  @HostListener('blur')
  private onTouched!: Function;
  

  writeValue(newValue: any): void {
    if (newValue instanceof Date) {
      // yyyy-mm-dd
      this.element.nativeElement.value = newValue.toISOString().split('T')[0];
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = (valueAsDate: Date) => {
      fn(valueAsDate);
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
}
