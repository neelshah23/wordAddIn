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

    requestData:any = {
        task: [{
            id: '123A1',
            details: 'Service Provider is required to notify Grant Thornton if it becomes aware of any changes to Project Personnel’s record'
        },{
            id: '123A2',
            details:'Service Provider may have pre-existing property rights in certain materials that Service Provider uses in providing Services and Deliverables hereunder (“Service Provider Property”).  Service Provider shall identify any Service Provider Property in the applicable SOW.  Service Provider hereby grants to Grant Thornton an irrevocable, perpetual, fully-paid, royalty-free, worldwide'
        },],
        clause: [{}]
    };

    constructor(private api: ApiCallService, private router: Router, private activeRoute: ActivatedRoute){
        this.getUserDetails();
        this.activeRoute.params.subscribe(data => {
            this.requestID = data.id;
            this.getTaskList();

        });

    }


    getUserDetails(){
        const user = localStorage.getItem("_u");
        if(user){
            this.userDetails = JSON.parse(user).data
        }  else {
            this.router.navigateByUrl('/login');
        }
    }

    highlightTask(task){
        this.searchString(task, 'yellow');
    }
    goBack(){
        history.back();
    }
    getTaskList(){
        this.api.callGetApi(`https://letscontract.run/activity/v1/getTask/${this.userDetails.id}/${this.requestID}`).subscribe((res:any) => {
            console.log(res.data);
            this.requestData.task = res.data;
        });
    }

    async searchString(str: any, color: string){
        return Word.run(async (context) => {
            const searchString = (str.details.length > 255)?str.details.substr(0,150):str.details;
            let activeDocument = context.document.body.search(searchString, {
                matchCase: false,
                matchWildcards: true,
                ignorePunct: true
            });
            const para = context.document.body.paragraphs;
            context.load(activeDocument, ['items']);
            context.load(para, ['items','text']);

            return context.sync()
                .then( async () => {
                    console.log(para.items);
                    const count = activeDocument.items.length;
                    // // Queue a set of commands to change the font for each found item.
                    if(count) {
                        for (let i = 0; i < count; i++) {
                            // if(activeDocument.items[i].font.highlightColor == color){
                            // activeDocument.items[i].font.highlightColor = color;
                            const serviceNameContentControl = activeDocument.items[i].insertContentControl();
                            serviceNameContentControl.title = 'task1';
                            serviceNameContentControl.tag = str.id;
                            serviceNameContentControl.appearance = "BoundingBox";
                            serviceNameContentControl.color = color;
                            serviceNameContentControl.select();
                            // } else {
                            //     activeDocument.items[i].font.highlightColor = color; //Yellow
                            // }b
                        }
                    }
                    return count;

                })
                .then(await context.sync()).catch(err => {
                    console.log(err);
                });

        });
    }

    /**
     * add content control to the selection
     *
     */
    createContentControl(){
        const title = "LCS";
        let tag = "Task:1|LAU:5|Action:TBD|2020-02-12";
        let base64FileString = false;

        Word.run(function (context) {

            const selectedRange = context.document.getSelection();
            const text = context.document.getSelection();

            const myContentControl = selectedRange.insertContentControl();
            myContentControl.tag = tag;
            myContentControl.title = title;
            if (!text) {
                myContentControl.placeholderText = '';
            }

            context.load(myContentControl, 'id');
            context.load(text, ['text']);

            return context.sync().then(function () {
                if (!base64FileString) {
                    myContentControl.insertHtml(text.text, 'Replace');
                }
                else {
                    myContentControl.insertFileFromBase64(base64FileString.toString(), 'Replace');
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

    HighlightContentControlById (tag: any) {
        Word.run(function (context) {

            const myContentControlObj = context.document.contentControls.getByTag(tag);

            context.load(myContentControlObj, 'id,text,font,tag');

            return context.sync().then(function () {
                // myContentControlObj.tag = myContentControlObj.tag;
                // myContentControlObj.text = myContentControlObj.text;
                // myContentControlObj.select();
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
    addTask(){
        this.router.navigate(['/addTask', this.requestID])
    }


}
