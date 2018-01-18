import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'page-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent{
    _status: boolean = false;
    mode: string = 'slide';
    position: string = 'left';
    backdrop: boolean = true;

    constructor(
        private router: Router,
    ) {}

    toggleOpened(): void {
        this._status = !this._status;
    }

    openStart() {
        // console.log('openStart');
    }

    opened() {
        // console.log('opened');
    }

    closeStart() {
        // console.log('closeStart');
    }

    closed() {
        // console.log('closed');
    }

    goUrl(_url) {
        this.router.navigate(['./' + _url]);
    }

    goBookingList() {
        this.router.navigate(['./booking/info'], {queryParams: {id: '389'}});
    }

    layout() {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('clinicId');
        this.router.navigate(['./login']);
    }
}
