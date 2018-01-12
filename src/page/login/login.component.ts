import { Component, ViewEncapsulation}     from '@angular/core';
import { Router }                          from '@angular/router';
import { ToptipsService }                  from 'ngx-weui/toptips';
import { ToastService }                    from 'ngx-weui/toast';

import { LoginService }                    from './login.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None
})

export class LoginComponent{
    formData: {
        username: string,
        password: string,
    }
    loading: boolean = false;

    constructor(
        private toptips: ToptipsService,
        private toast: ToastService,
        private loginService: LoginService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.formData = {
            username: '',
            password: '',
        }
    }

    login() {
        if(this.formData.username == ''){
            this.toptips.warn('用户名不可为空');
            return;
        }
        if(this.formData.password == ''){
            this.toptips.warn('密码不可为空');
            return;
        }
        this.loading = true;
        this.toast.loading('登录中', 100000);
        var params = {
            username: this.formData.username,
            password: this.formData.password,
        }
        this.loginService.adminlogin(params).then((data) => {
            this.toast.hide();
            if(data.status == 'no'){
                this.toptips.warn(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                sessionStorage.setItem('username', results.admininfo.username);
                sessionStorage.setItem('token', results.admininfo.token);
                this.router.navigate(['./user']);
            }
            this.loading = false;
        });
    }
}
