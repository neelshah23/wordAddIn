import { Component } from '@angular/core';
import {ApiCallService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";

declare const fabric: any;
const Home = require('./addTask.html');


@Component({
    selector: "app-add-task",
    styles:[`
        .full-width{
            width: 100%;
        }
        .mat-raised-button.mat-accent {
            color: #fff;
        }
    `],
    template: Home,
})
export class AddTaskComponent {
    userDetails: any = {name: ''};
    requestID: string;
    taskData_update: any;
    isNewTask: boolean;
    taskData = {
        "request_id": null,
        "clause": "task clause",
        userComment: '',
        "department": "finance",
        "content_control": "task content control",
        "assign": "neel.shah@iauro.com",
        user_id: null,
        comment: []
    }
    requestData: any;
    taskStatus = ['need to review', 'done'];

    myTeam: any[] = [];
    departments: any[] = [];

    constructor(private api: ApiCallService, private router: Router, private activeRoute: ActivatedRoute){
        this.getUserDetails();
        this.activeRoute.params.subscribe(data => {
            this.requestID = this.taskData.request_id = data.id;
            this.isNewTask = (data.op === "1");
            this.getTeam();
        });
        this.requestData = JSON.parse(localStorage.getItem('_rd'));
        const _td = localStorage.getItem('_td');
        this.taskData_update = ( _td && _td !== 'null')?JSON.parse(_td): null;
        if(this.taskData_update) {
            this.taskData['id'] = this.taskData_update.id;
            this.taskData.comment = this.taskData_update.comment;
            this.taskData['status'] = this.taskData_update.status;
            this.highlightContentControlById(this.taskData_update.content_control);
        }
    }


    getUserDetails(){
        const user = localStorage.getItem("_u");
        if(user){
            this.userDetails = JSON.parse(user).data;
            this.taskData.assign = this.userDetails.email;


        }  else {
            this.router.navigateByUrl('/login');
        }
    }


    goBack(){
        history.back();
    }

    addTask(){
        const _tempComment = {
            message: this.taskData.userComment,
            name: this.userDetails.name,
            userId:this.userDetails.id,
            date: new Date()
        };

        if(this.isNewTask) {
            delete this.taskData.userComment;
            this.taskData.comment.push(_tempComment);

            this.api.callPostApi(`https://letscontract.run/activity/v1/tasks`, this.taskData).subscribe((res: any) => {
                this.goBack();
            });
        } else {

            if(this.taskData.userComment !== ''){
                this.taskData.comment.push(_tempComment);
            }
            delete this.taskData.userComment;
            this.api.callPutApi(`https://letscontract.run/activity/v1/tasks/${this.taskData['id']}`, this.taskData).subscribe((res: any) => {
                this.goBack();
            });
        }
    }
    getTeam(){
        this.api.callGetApi(`https://letscontract.run/activity/v1/team/members/${this.requestID}/${this.userDetails.id}`).subscribe((res:any) => {
            this.myTeam = res.data;
        });
    }

    /**
     * add content control to the selection
     *
     */
    createContentControl(){
        const title = "LCS";
        let tag = `Task:${new Date().getTime()}|${this.requestData.id}`;
        let base64FileString = false;

        Word.run( (context) => {

            const selectedRange = context.document.getSelection();
            const text = context.document.getSelection();

            const myContentControl = selectedRange.insertContentControl();
            myContentControl.tag = tag;
            myContentControl.title = title;


            context.load(myContentControl, 'id');
            context.load(text, ['text']);

            return context.sync().then( () => {

                if (!base64FileString) {
                    // myContentControl.insertHtml(text.text, 'Replace');
                    this.taskData.content_control = tag;
                }
                else {
                    myContentControl.insertFileFromBase64(base64FileString.toString(), 'Replace');
                }
                if (text.text) {
                    this.taskData.clause = text.text;
                }
                myContentControl.cannotEdit = false;
                myContentControl.appearance = 'BoundingBox';

                let searchResults = myContentControl.search('\|\**\*\|', { matchWildcards: true });

                context.load(searchResults, 'text');

                return context.sync().then(function () {

                    for (let i = 0; i < searchResults.items.length; i++) {

                        const found = searchResults.items[i].text;

                        let res = found.replace(/^\|\*/g, "");
                        res = res.replace(/\*\|$/g, "");

                        let range = searchResults.items[i];
                        let subCC = range.insertContentControl();
                        subCC.tag = res;
                        subCC.title = res;
                        subCC.insertText(res, 'Replace');
                        subCC.cannotEdit = false;
                        subCC.appearance = 'BoundingBox';

                        context.load(subCC, 'id');

                        context.sync().then(function () {
                            console.log('Created content control with id: ' + subCC.id);
                        });

                    }

                });

            });
        })
            .catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
                if (error instanceof OfficeExtension.Error) {
                    console.log('Debug info: ' + JSON.stringify(error.debugInfo));
                }
            });

    }
    updateUserDept(data){

        for (let i = 0; i <  this.myTeam.length; i++){
            const item = this.myTeam[i];
            if(item.id === data.value){
                this.taskData.department =  item.team;
            }
        }
    }
    highlightContentControlById (tag: any) {
        Word.run( (context) => {
            const myContentControlObj = context.document.contentControls.getByTag(tag);
            context.load(myContentControlObj, 'id,text,font,tag');
            return context.sync().then( () => {
                for (let i = 0; i < myContentControlObj.items.length; i++) {
                    const _temp = myContentControlObj.items[i];
                    _temp.color="yellow";
                    _temp.select();
                }
                return myContentControlObj;
            });
        })
            .catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
                if (error instanceof OfficeExtension.Error) {
                    console.log('Debug info: ' + JSON.stringify(error.debugInfo));

                }
            });
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
