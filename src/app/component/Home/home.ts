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
    userDetails: any = {name:''};

    userData:any = {
        task: [{
            id: '123A1',
            details: 'This style is called List Bullet.'
        },{
            id: '123A2',
            details:'If a Transition Deliverable or Transition Milestone is not Accepted, due to the fault of Service Provider, on or before the applicable Transition Acceptance Date, Service Provider will reimburse BJC for BJC’s costs and expenses associated with such '
        },],
        clause: [{}]
    };

    constructor(private api: ApiCallService, private router: Router){
        this.getUserDetails();
    }


    getUserDetails(){
        const user = localStorage.getItem("_u");
        if(user){
            this.userDetails = JSON.parse(user).result
        }  else {
            this.router.navigateByUrl('/login');
        }
    }
    highlightTask(task){
        this.searchString(task, 'yellow');
    }

    async searchString(str: any, color: string){
        return Word.run(async (context) => {
            let activeDocument = context.document.body.search(str.details, {
                ignorePunct: true,
                ignoreSpace: true,
                matchCase: false,
                matchWildcards: true
            });
            context.load(activeDocument, ['text','properties','comments', 'title','lists','paragraphs', 'listItem']);

            return context.sync()
                .then( async ()=> {
                    const count = activeDocument.items.length;
                    // // Queue a set of commands to change the font for each found item.
                    if(count) {
                        for (let i = 0; i < count; i++) {
                            // if(activeDocument.items[i].font.highlightColor == color){
                            const serviceNameContentControl = activeDocument.items[i].insertContentControl();
                            serviceNameContentControl.title = '';
                            serviceNameContentControl.tag = str.id;
                            serviceNameContentControl.appearance = "Tags";
                            serviceNameContentControl.color = color;
                            activeDocument.items[i].font.highlightColor = color;
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


}
