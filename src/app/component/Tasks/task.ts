import { Component } from '@angular/core';
import {ApiCallService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";

declare const fabric: any;
const Home = require('./task.html');


@Component({
    selector: "app-task",
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
export class TaskComponent {
    userDetails: any = {name: ''};
    requestID: string;
    requestData: any;

    taskData:any = {
        task: [{}],
        clause: [{}]
    };

    constructor(private api: ApiCallService, private router: Router, private activeRoute: ActivatedRoute){
        this.getUserDetails();
        this.activeRoute.params.subscribe(data => {
            this.requestID = data.id;
            this.getTaskList();
        });
        this.requestData = JSON.parse(localStorage.getItem('_rd'));

    }

    getUserDetails(){
        const user = localStorage.getItem("_u");
        if(user){
            this.userDetails = JSON.parse(user).data
        }  else {
            this.router.navigateByUrl('/login');
        }
    }
    goBack(){
        history.back();
    }
    getTaskList(){
        this.api.callGetApi(`https://letscontract.run/activity/v1/getTask/${this.userDetails.id}/${this.requestID}`).subscribe((res:any) => {
            this.taskData.task = res.data;
        });
    }



    upsertTask(op: number, data?: any ){
        if(!op){
            localStorage.setItem('_td',JSON.stringify(data));
        } else {
            localStorage.setItem('_td', 'null');
        }
        this.router.navigate(['/addTask', this.requestID, op]);
    }
    getInitial(str){
        if (!str) { return ''; }
        str = str.toLowerCase().split(' ');

        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].split('');
            str[i] = str[i][0].toUpperCase();
        }
        return str.join('');
    }
}
