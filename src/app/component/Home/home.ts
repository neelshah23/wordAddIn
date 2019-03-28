import { Component } from '@angular/core';
import {ApiCallService} from "../../api.service";
import {Router} from "@angular/router";
const Home = require('./home.html');

@Component({
  selector: "app-home",
    template: Home,
})
export class HomeComponent {
    userDetails: any = {name:''};

    constructor(private api: ApiCallService, private router: Router){
        this.getUserDetails();
    }


    getUserDetails(){
        const user = localStorage.getItem("_u");
        console.log(user);
        if(user){
            this.userDetails = JSON.parse(user)
        }  else {
            // this.router.navigateByUrl('/login');
        }
    }

}
