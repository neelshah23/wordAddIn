import { Component } from '@angular/core';
import {ApiCallService} from "../../api.service";
import {Router} from "@angular/router";

declare const fabric: any;
const Home = require('./home.html');


@Component({
    selector: "app-home",
    styles:[`
        .list p{
            font-size: 16px;
            padding: 15px;
        }
        .list p:nth-of-type(odd){
            background-color: #f7f7f7;
        }`],
    template: Home,
})
export class HomeComponent {

    myRequest: any;
    userDetails:any = {name: ''} ;

    constructor(private api: ApiCallService, private router: Router){
        this.getMyRequest();
    }

    getMyRequest(){
        this.api.callGetApi(`https://letscontract.run/activity/v1/request/user/7?status=All&page=0&limit=10&search_text=`).subscribe((res:any) => {
            console.log(res.data);
            this.myRequest = res.data.requests;
        });
    }
    showRequestDetails(requestID){
        this.router.navigate(['/task',requestID]);
    }


}
