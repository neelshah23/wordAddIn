import { Component, OnInit  } from '@angular/core';


const template = require('./app.component.html');

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
            let activePage = context.document;

            context.load(activePage.properties, ['comments']);

            await context.sync().then( () => {
                const comments  = activePage.properties.comments;
                console.log(comments);
            });

        });
    }
}