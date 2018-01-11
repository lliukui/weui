import { Injectable }                       from '@angular/core';
import { Headers, Http, RequestOptions }    from '@angular/http';
import { Observable }                       from 'rxjs/Observable';
import { ToptipsService }            from "ngx-weui/toptips";

import 'rxjs/add/operator/toPromise';

import { Data }                             from '../data';
import { config }                           from '../config';

@Injectable()
export class LoginService {
	url = config.baseHTTP;

  	constructor(
        private toptips: ToptipsService,
		private http: Http,
	) {

	}

	private adminloginUrl = this.url + '/mebcrm/adminlogin';
	adminlogin(params): Promise<Data>{
		return this.http.post(this.adminloginUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch((error) => {
				this.toptips.warn('服务器错误，请重试');
			});
	}

}
