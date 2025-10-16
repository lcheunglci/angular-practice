// import { CanActivateFn } from '@angular/router';

import { inject } from "@angular/core";
import { CanMatch, GuardResult, MaybeAsync, Route, UrlSegment } from "@angular/router";
import { CartService } from "@shared/services";
import { map, Observable } from "rxjs";

// export const canLoadHeavyGuard: CanActivateFn = (route, state) => {
//   return true;
// };

export class CanLoadHeavyGuard implements CanMatch {

  private cartService = inject(CartService);

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.cartService.getItems().pipe(
      map(items => items.length < 5)
    )

  }
}
