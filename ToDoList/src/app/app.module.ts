import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from "angular-datatables";
import { AppComponent } from './app.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { ToDoService } from './components/toDo.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    ToDoListComponent
  ],
  imports: [BrowserModule, DataTablesModule, FormsModule, HttpClientModule, BrowserAnimationsModule, MatSortModule, MatButtonModule, MatIconModule],
  providers: [ToDoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
