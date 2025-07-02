import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { retry, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { COFFEE_API_RETRY_COUNT } from '../services/coffee-api.service';

export const retryInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    // If a retry count given by a context token is available - use that - otherwise fall back to a default from config
    const retryCount = req.context.get(COFFEE_API_RETRY_COUNT) || environment.retryInterceptorRetryCount;

    return next(req).pipe(
        retry({
          count: retryCount,
          delay: (err, attemptNum) => {
            console.error(`[RetryInterceptor] => Encountered an error while retrying request on attempt ${attemptNum}: `, err)
            return timer(1000 * attemptNum);
          }
        }),
    );
};

