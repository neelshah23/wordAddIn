import { Component, OnInit } from '@angular/core';
import {ApiCallService} from "../../api.service";
import {Router} from "@angular/router";

declare const fabric: any;
const Home = require('./home.html');


@Component({
    selector: "app-home",
    styles:[`
        .myHeader {
            border-bottom: 1px solid #efefef;
            border-top: 1px solid #efefef;
            padding: 15px 10px;
        }

        .searchWrapper {
            border-bottom: 1px solid #efefef;
            padding: 5px 10px;
        }
        .searchIconWrapper{
            align-items: center;
            background-color: #efefef;
            display: flex;
            padding: 0 10px;
            color: #000000;
        }

        .searchWrapper input {
            background-color: #f7f7f7;
            color: #333;
            border-radius: 3px 0 0 3px;
            padding: 13px;
            box-shadow: none;
            outline: 0;
            width: 65%;
            border: 0;
            font-size: 14px;
            margin: 0;
        }
        .requestStatus{
            color: #000000;
            border-radius: 20px;
            border: 1px solid #000000;
            padding: 4px 10px;
            font-size: 12px;
        }
        .requestName{
            color: #04122E;
            font-size: 18px;
            font-weight: bold;
            line-height: 18px;
            padding: 15px 0;
        }
        .myRequestData{
            padding: 15px;
            border-bottom: 1px solid #efefef;
        }

        .list p {
            font-size: 16px;
            padding: 15px;
        }

        .list .myRequestData:nth-of-type(odd) {
            background-color: #f7f7f7;
        }`],
    template: Home,
})
export class HomeComponent implements OnInit{

    myRequest: any;
    userDetails: any = {name: ''} ;

    constructor(private api: ApiCallService, private router: Router){
        this.getUserDetails();

    }

    ngOnInit(): void {
        console.log('sdf');
        this.getMyRequest();
    }
    getMyRequest(){
        console.log('adasdas');

        this.api.callGetApi(`https://letscontract.run/activity/v1/request/user/${this.userDetails.id}?status=All&page=0&limit=10&search_text=`).subscribe((res:any) => {
            console.log(res.data);
            this.myRequest = res.data.requests;
        });
    }
    showRequestDetails(requestData){
        localStorage.setItem('_rd',JSON.stringify(requestData));
        this.router.navigate(['/task',requestData.id]);
    }


    getUserDetails(){
        const user = localStorage.getItem("_u");
        if(user){
            this.userDetails = JSON.parse(user).data
        }  else {
            localStorage.clear();
            this.router.navigateByUrl('/login');
        }
    }


}
