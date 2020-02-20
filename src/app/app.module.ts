import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import AppComponent from './app.component';
import {FormsModule} from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./component/Login/login";
import {HomeComponent} from "./component/Home/home";
import {MatTabsModule, MatButtonModule, MatListModule, MatDividerModule, MatInputModule, MatCardModule, MatSelectModule} from '@angular/material';
import {TaskComponent} from "./component/Tasks/task";
import {AddTaskComponent} from "./component/AddTask/addTask";

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'task/:id', component: TaskComponent },
    { path: 'addTask/:id/:op', component: AddTaskComponent }
];
@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, TaskComponent,AddTaskComponent],
  imports: [
      BrowserModule,
      HttpModule,
      NoopAnimationsModule,
      HttpClientModule,
      FormsModule,
      RouterModule.forRoot(routes,{useHash: true}),
      MatTabsModule,
      MatDividerModule,
      MatListModule,
      MatCardModule,
      MatInputModule,
      MatButtonModule, MatSelectModule],
  bootstrap: [AppComponent]
})
export default class AppModule { }