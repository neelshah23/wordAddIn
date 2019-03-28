import { Component, OnInit  } from '@angular/core';
import * as $ from 'jquery';
import {ApiCallService} from "./api.service";

const template = require('./app.component.html');
const parser = new DOMParser();

const comment_template = '<w:comment w:id="3" w:author="Microsoft Office User" w:date="2019-03-18T18:26:00Z" w:initials="MOU">\n' +
    '                    <w:p w:rsidR="00076C74" w:rsidRDefault="00076C74">\n' +
    '                        <w:pPr>\n' +
    '                            <w:pStyle w:val="CommentText" />\n' +
    '                        </w:pPr>\n' +
    '                        <w:r>\n' +
    '                            <w:rPr>\n' +
    '                                <w:rStyle w:val="CommentReference" />\n' +
    '                            </w:rPr>\n' +
    '                            <w:annotationRef />\n' +
    '                        </w:r>\n' +
    '                        <w:r>\n' +
    '                            <w:t>Neel shah auto comment</w:t>\n' +
    '                        </w:r>\n' +
    '                    </w:p>\n' +
    '                </w:comment>';
const comment_start = '<w:commentRangeStart w:id="3" />';
const comment_end = '<w:commentRangeEnd w:id="3" />';
@Component({
    selector: 'app-home',
    template,
    providers: [ApiCallService]
})
export default class AppComponent implements OnInit{


    ngOnInit() {
        // this.run();
        // this.callAPI();
    }
    constructor(private api: ApiCallService){

    }



    async run() {
        return Word.run(async (context) => {
            let activePage = context.application;

            let properties = context.document.body.getOoxml();


            context.load(activePage, ['text','properties','comments', 'title','lists','paragraphs', 'listItem']);

            await context.sync().then( () => {

                const xmlString = properties.value;
                const xmlDoc = parser.parseFromString(xmlString,"text/xml");
                const $xml = $( xmlDoc );

                $(comment_start).prependTo($xml.find( "w\\:t" ).first().parent());
                $('<w:commentReference w:id="3" />').appendTo($xml.find( "w\\:t" ).first());
                $(comment_end).appendTo($xml.find( "w\\:t" ).first().parent());
                $(comment_template).appendTo($xml.find('w\\:comments'));

                const newDoc = new XMLSerializer().serializeToString($xml[0]);
                context.document.body.insertOoxml(newDoc, "Replace");
                properties = context.document.body.getOoxml();

            });
            context.sync().then(() => {
                // console.log(properties.value);
            });


        });
    }



    async searchString(str, color){
        return Word.run(async (context) => {
            let activeDocument = context.document.body.search(str, {
                ignorePunct: true,
                ignoreSpace: true,
                matchCase: false,
                matchWildcards: true
            });
            context.load(activeDocument, "");
            return context.sync()
                .then( async ()=> {
                    const count = activeDocument.items.length;
                    // // Queue a set of commands to change the font for each found item.
                    for (let i = 0; i < count; i++) {
                        // if(activeDocument.items[i].font.highlightColor == color){
                        const serviceNameContentControl = activeDocument.items[i].insertContentControl();
                        // serviceNameContentControl.title = str;
                        serviceNameContentControl.tag = str;
                        serviceNameContentControl.appearance = "Tags";
                        serviceNameContentControl.color = color;
                        // activeDocument.items[i].font.highlightColor = color;
                        // } else {
                        //     activeDocument.items[i].font.highlightColor = color; //Yellow
                        // }b
                    }
                    return count;
                })
                .then(await context.sync());

        });
    }

    clearContentControll(){

    }


}