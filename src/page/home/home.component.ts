import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'page-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent{
    _status: boolean = false;
    mode: string = 'over';
    position: string = 'cover';
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

    layout() {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('clinicId');
        this.router.navigate(['./login']);
    }
}
