import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Exchange} from '../exchange.model';
import {ExchangeDataPromiseService} from './exchange-data-promise.service';
import {AuthenticationService} from '../../../shared/authentication.service';
import {RestApiUrlService} from '../../../shared/rest-api-url.service';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Exchange Data Service.
 *
 * It demonstrates use of Promises in call responses.
 *
 * We chain the toPromise operator to the Observable result of http.get. It converts the Observable into a Promise
 * which is passed back to the caller.
 *
 * Converting to a promise is a good choice when asking http.get to fetch a single chunk of data - when we receive the
 * data, we're done. A single result in the form of a promise is easy for the calling component to understand/consume.
 *
 * @author gazbert
 */
@Injectable()
export class ExchangeHttpDataPromiseService implements ExchangeDataPromiseService {

    private static ENDPOINT_PATH = '/exchange';

    constructor(private http: Http) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getExchangeByBotId(botId: string): Promise<Exchange> {
        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, ExchangeHttpDataPromiseService.ENDPOINT_PATH);
        return this.http.get(url)
            .toPromise()
            // TODO - upgrade HTTP to get rid of json() stuff + upgrade in-memory-data-service to get rid of data wrapper
            .then(response => response.json().data as Exchange)
            .catch(ExchangeHttpDataPromiseService.handleError);
    }

    updateExchange(botId: string, exchange: Exchange): Promise<Exchange> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, exchange.id, ExchangeHttpDataPromiseService.ENDPOINT_PATH);
        return this.http
            .put(url, JSON.stringify(exchange), {headers: headers})
            .toPromise()
            // TODO - upgrade HTTP to get rid of json() stuff + upgrade in-memory-data-service to get rid of data wrapper
            .then(response => response.json().data as Exchange)
            .catch(ExchangeHttpDataPromiseService.handleError);
    }
}
