import { Directive, forwardRef, Provider } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';

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
export class DateValueAccessorDirective {
  constructor() {}
}
