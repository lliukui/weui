import { Component, ViewEncapsulation}     from '@angular/core';
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

    constructor(
        private toptips: ToptipsService,
        private toast: ToastService,
        private loginService: LoginService,
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
        this.toast.show('登录中', 0, 'loading');
        var params = {
            username: this.formData.username,
            password: this.formData.password,
        }
        this.loginService.adminlogin(params).then((data) => {
            console.log(data);
            if(data.status == 'no'){
                this.toptips.warn(data.errorMsg);
            }else{

            }
        });
    }
}
