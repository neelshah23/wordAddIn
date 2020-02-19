import { Component } from '@angular/core';
import {ApiCallService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";

declare const fabric: any;
const Home = require('./addTask.html');


@Component({
    selector: "app-add-task",
    styles:[`
        /*app-add-task .mat-form-field-label{*/
        /*    color: #2F4F91 !important;*/
        /*}*/
        /*app-add-task .mat-form-field-underline{*/
        /*    color: #2F4F91 !important;*/
        /*    background: #2F4F91 !important;*/
        /*}*/
        .mat-raised-button.mat-accent {
            color: #fff;
        }
        `],
    template: Home,
})
export class AddTaskComponent {
    userDetails: any = {name: ''};
    requestID: string;
    _myTeam: any;
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

    myTeam: any[] = [];
    departments: any[] = [];

    constructor(private api: ApiCallService, private router: Router, private activeRoute: ActivatedRoute){
        this.getUserDetails();
        this.activeRoute.params.subscribe(data => {
            this.requestID = this.taskData.request_id = data.id;
            this.getTeam();
        });

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
            user_name: this.userDetails.name,
            user_id:this.userDetails.id,
            user_email: this.userDetails.email,
            created_at: new Date()
        };
        this.taskData.comment.push(_tempComment);
        delete this.taskData.userComment;

        this.api.callPostApi(`https://letscontract.run/activity/v1/tasks`,this.taskData).subscribe((res:any) => {
            console.log(res.data);
        });
    }
    getTeam(){
        this.api.callGetApi(`https://letscontract.run/activity/v1/team/members/${this.requestID}/${this.userDetails.id}`).subscribe((res:any) => {
            // this._myTeam = res.data.team_structure;
            // this.departments = Object.keys(this._myTeam);
            // this.taskData.department = this.departments[0];
            console.log(res.data);
            this.myTeam = res.data;
        });
    }
    updateTeam(){
        this.myTeam = this._myTeam[this.taskData.department];
    }

    /**
     * add content control to the selection
     *
     */
    createContentControl(){
        const title = "LCS";
        let tag = "Task:1|LAU:5|Action:TBD|2020-02-12";
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
}
