import { Headers, Http, RequestOptions }          from '@angular/http';
import { Injectable }                             from '@angular/core';

import { Data }                                   from './data';
import { config }                                 from './config';

@Injectable()
export class PageService{
	url = config.baseHTTP;

	constructor(
		private http: Http,
	) {
	}

	//查询后台用户
	private adminlistUrl = this.url + '/mebcrm/adminlist';
	adminlist(urlOptions): Promise<Data>{
		return this.http.get(this.adminlistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询宝宝科室列表
	private servicelistUrl = this.url + '/mebcrm/servicelist';
	servicelist(urlOptions): Promise<Data>{
		return this.http.get(this.servicelistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//根据科室查询医生可预约日期
	private searchdoctorserviceUrl = this.url + '/mebcrm/searchdoctorservice';
	searchdoctorservice(urlOptions): Promise<Data>{
		return this.http.get(this.searchdoctorserviceUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建预约
	private bookingcreateUrl = this.url + '/mebcrm/bookingcreate';
	bookingcreate(param): Promise<Data>{
		return this.http.post(this.bookingcreateUrl, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询宝宝
	private searchchildUrl = this.url + '/mebcrm/searchchild';
	searchchild(urlOptions): Promise<Data>{
		return this.http.get(this.searchchildUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询用户及其孩子
	private searchuserUrl = this.url + '/mebcrm/searchuser';
	searchuser(urlOptions): Promise<Data>{
		return this.http.get(this.searchuserUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询预约列表
	private searchbookingUrl = this.url + '/mebcrm/searchbooking';
	searchbooking(urlOptions): Promise<Data>{
		return this.http.get(this.searchbookingUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 去除左右空格
	trim(str){
		if(str == '' || str == undefined || str == null){
			return str;
		}else{
		    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
		}
	}

	// 验证手机号
	checkMobile(mobile) {
		if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(mobile))){
			return false;
		}
		return true;
	}

	//保留两位小数
	toDecimal2(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return '0.00';
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
    	//小数点不足两位
    	if(s.length <= rs + 2){
	        while (s.length <= rs + 2) {
	            s += '0';
	        }
    	}else{
    		//小数点超过两位
    		s = s.substring(0, rs + 3);
    	}
        return s;
    }

	//获取周日期
	getWeekByNumber(value) {
		//当天日期
		var nowDate = new Date();
		//当天为周几
		var nowDay = (nowDate.getDay() == 0 ? 7 : nowDate.getDay());
		//周当天日期
		var weekNowDate = new Date(nowDate.getTime() + (value * 7 * 24 * 60 * 60 * 1000));
		//周日期列表
		var weekArray = new Array();
		//该周周一
		var weekFirst = new Date(weekNowDate.getTime() - ((nowDay - 1) * 24 * 60 * 60 * 1000));
		//周日起
		for(var i = 0; i < 7; i++){
			var weekDay = new Date(weekFirst.getTime() + i * 24 * 60 * 60 * 1000);
			weekArray.push(this.getDayByDate(weekDay));
		}
		return weekArray;
	}

	//根据date获取日期
	getDayByDate(date) {
      	var d = date.getDate(),
      		m = date.getMonth(),
      		y = date.getFullYear();
      	return y + '-' + ((m + 1) > 9 ? (m + 1) : ('0' + (m + 1))) + '-' + (d > 9 ? d : ('0' + d));
    }

	// 日期格式转换
	dateFormat(date) {
		if(!this.isFalse(date)){
			var dateArray = date.split('-');
			return dateArray[0] + '年' + dateArray[1] + '月' + dateArray[2] + '日';
		}else{
			return '';
		}
	}

	// 日期转换
	dateFormatHasWord(date) {
		date = date.replace('年', '-');
		date = date.replace('月', '-');
		date = date.replace('日', '');
		return date;
	}

    //获取周几
	getWeekTitle(value) {
		var title = '';
		switch(value){
			case 0:
				title = '星期一';
				break;
			case 1:
				title = '星期二';
				break;
			case 2:
				title = '星期三';
				break;
			case 3:
				title = '星期四';
				break;
			case 4:
				title = '星期五';
				break;
			case 5:
				title = '星期六';
				break;
			case 6:
				title = '星期天';
				break;
		}
		return title;
	}

	//删除cookie
	delCookie(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 2*24*60*60*1000);
		var cval= this.getCookie(name);
		if(cval!=null){
			var pathList = [
				'/',
				'/admin',
				'/admin/workbench',
				'/admin/material',
				'/admin/medical',
				'/admin/scheduling',
				'/admin/prescript',
				'/admin/authorize',
				'/admin/doctor',
				'/admin/crmuser',
				'/admin/docbooking',
			]
			for(var i in pathList){
				document.cookie = name + "=" + cval + ";expires=" + exp + ";Path=" + pathList[i];
			}
		}
	}

	//设置cookie
	setCookie(name, value, time){
		var Days = time;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "=" + value + ";expires=" + exp + ";Path=/";
	}

	//读取cookie
	getCookie(name){
        var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return arr[2];
        else
        return null;
    }

	// 非空
	isFalse(_value) {
		switch(_value){
			case null:
				return true;
			case undefined:
				return true;
			case '':
				return true;
			default:
				return false;
		}
	}

	//获取参数json
	getUrlParams(url) {
		var urlQuery = url.substring(url.indexOf('?') + 1).split('&');
		var queryString = '{';
		for(var i = 0; i < urlQuery.length; i++){
			queryString += '"' + urlQuery[i].split('=')[0] + '":' + '"' + urlQuery[i].split('=')[1].replace('%2F', '/') + '",';
		}
		if(queryString.length > 1){
			queryString = queryString.slice(0, queryString.length -1);
		}
		queryString += '}';
		return JSON.parse(queryString);
	}

	// 颜色码
	colorList() {
		return [
			'color1',
			'color2',
			'color3',
			'color4',
			'color5',
			'color6',
			'color7',
			'color8',
			'color9',
			'color10',
		];
	}

	isArray(o) {
		return Object.prototype.toString.call(o)=='[object Array]';
	}
}
