import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToDo } from '../ToDo.model';
import { ToDoService } from '../toDo.service';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit, OnDestroy {
  todos: ToDo[];
  states = ['Pendiente', 'En Proceso', 'Finalizado'];
  idd:number;
  subscription: Subscription;

  sortedData: ToDo[];

  constructor(private tdsl:ToDoService) { 
    
  }

  sortData(sort: Sort) {
    const data = this.todos.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'tarea': return this.compare(a.name, b.name, isAsc);
        case 'estado': return this.compare(a.state, b.state, isAsc);
        case 'fecha': return this.compare(a.date, b.date, isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnInit(): void {
    this.todos=this.tdsl.getTodoList();
    this.idd = this.todos[this.todos.length - 1].id + 1;
    this.subscription = this.tdsl.notifyChanges.subscribe((todoList: ToDo[]) => {
      this.todos = todoList;
      this.sortedData = todoList;
    });
    
  }

  removeToDo(id:number){
    this.tdsl.removeToDo(id);
  }


  addToDo(form:NgForm){
    //this.todos.push(new ToDo(this.idd++,form.value.name,"Pendiente"));
    this.tdsl.addToDo(form.value.name,"Pendiente", new Date(form.value.date));
    form.reset();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  updateState(id:number, state:string){
    this.tdsl.updateState(id, state);
  }
}