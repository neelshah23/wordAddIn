import { Component, OnInit  } from '@angular/core';
import * as $ from 'jquery';

const template = require('./app.component.html');
const parser = new DOMParser();

const comment_template = '<w:comment w:id="2" w:author="Microsoft Office User" w:date="2019-03-18T18:26:00Z" w:initials="MOU">\n' +
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
@Component({
    selector: 'app-home',
    template
})
export default class AppComponent implements OnInit{

    ngOnInit() {
        this.run();
    }




    async run() {

        return Word.run(async (context) => {
            let activePage = context.document.body;
            let properties = context.document.body.getOoxml();

            context.load(activePage, ['text','properties','comments', 'title','lists','paragraphs', 'listItem']);

            await context.sync().then( () => {

                const xmlString = properties.value;
                console.log("before", xmlString);

                const xmlDoc = parser.parseFromString(xmlString,"text/xml");
                const $xml = $( xmlDoc ), $title = $xml.find( "w\\:t" )[0];
                $title.before('<w:commentRangeStart w:id="2" />');
                $title.after('<w:commentRangeEnd w:id="2" />');
                const e = $xml.find('w\\:comments').append(comment_template);
                console.log($xml);
                // context.document.body.insertOoxml($)

            });

        });
    }
}