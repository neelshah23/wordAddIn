import { Component } from '@angular/core';
import {ApiCallService} from "../../api.service";
import * as CryptoJS from 'crypto-js';
import {Router} from "@angular/router";
const Login = require('./login.html');

@Component({
  selector: "app-login",
    template: Login,
})
export class LoginComponent {
    user: any = {
        email: 'BV0T12536@techmahindra.com',
        password: 'BV$0T12536'
    };
    constructor(private api: ApiCallService, private router: Router){}

    callAPI(){
        const user = {
            email: this.user.email,
            password: this.encrypt(this.user.password)
        };
        this.api.callPostApi('https://ms-shared-nad.techmahindra.com/000000000032856-nad-rbac-microservice-development/login', user).subscribe(res => {
            localStorage.setItem('_u', JSON.stringify(res));
            this.router.navigateByUrl('/home');


        });


    }
    encrypt(text) {
        const crypted = CryptoJS.AES.encrypt(text, "SDF$%GHBH344D");
        return crypted.toString();
    }
}
