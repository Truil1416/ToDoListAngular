import { HttpClient } from "@angular/common/http";
import { ConditionalExpr } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { ToDo } from "./ToDo.model";


//import * as data from '../../assets/data.json';

//const express = require("express");

@Injectable({ providedIn:'root' })
export class ToDoService{
    lastIndexAssigned = -1;
    public notifyChanges = new Subject<ToDo[]>();
    
    ToDoList:ToDo[] = [
        new ToDo(-1,"Proceso base, si se ve es un error", "No Tocar", new Date())
    ];

    
    ToDoListFinished:ToDo[]=[];

    constructor(private httpClient: HttpClient){

        this.httpClient.get("http://localhost:3000/api/descargar", {responseType:"json"})
         .pipe(
             map(data => {
                const algo: ToDo[] =[];
                //console.log(data);
                for (const key in data){
                    //console.log(data[key]);
                    const todo = new ToDo(+data[key].id, data[key].name, data[key].state, new Date(data[key].date));
                    if(+data[key].id > this.lastIndexAssigned){
                        this.lastIndexAssigned = +data[key].id+1;
                    }
                    algo.push(todo);
                }
                return algo;
            })
         )
        .subscribe(data =>{
            this.removeToDo(-1);
            this.ToDoList.push(...data);
            console.log('To do´s:', data);
        })
        this.httpClient.get("http://localhost:3000/api/descargarHistorico", {responseType:"json"})
         .pipe(
             map(data => {
                const algo: ToDo[] =[];
                //console.log(data);
                for (const key in data){
                    //console.log(data[key]);
                    const todo = new ToDo(+data[key].id, data[key].name, data[key].state, new Date(data[key].date));
                    if(+data[key].id > this.lastIndexAssigned){
                        this.lastIndexAssigned = +data[key].id+1;
                    }
                    algo.push(todo);
                }
                return algo;
            })
         )
        .subscribe(data =>{
            this.ToDoListFinished.push(...data);
            console.log('Historico: ',data);
            console.log(this.lastIndexAssigned);
        })
        
    }

    getTodoList(){
        return this.ToDoList;
    }

    addToDo(name: string, state: string, date: Date){
        this.ToDoList.push(
            new ToDo(this.lastIndexAssigned++, name, state, date)
        );
        var theJSON = JSON.stringify(this.ToDoList);

        this.uploadFile(theJSON).subscribe((res) => {
            console.log('Response: ', res);
            this.noitfyToDoChanges();
        });

        //var fs = require('fs');
        /* fs.writeFileSync('assets/data.json', theJSON, 'utf8',function(err) {
            if (err) throw err;
            console.log('complete');
            }
        ); */
        //fs.writeFileSync('assets/data.json', theJSON);
        
        /* const fs = require('fs');
        fs.writeFile('helloworld.txt', 'The Function was called', function (err) {
            if (err) 
            return console.log(err);
            console.log('Wrote Hello World in file helloworld.txt, just check it');
        }); */
        
        

        //this.noitfyToDoChanges();
    }

    removeToDo(id: number){
        this.ToDoList = this.ToDoList.filter((v, i) => v.id != id);
        if (id != -1){
            var theJSON = JSON.stringify(this.ToDoList);

            this.uploadFile(theJSON).subscribe((res) => {
                console.log('Response: ', res);
                this.noitfyToDoChanges();
            });
        }else{
            this.noitfyToDoChanges();
        }
    }
    updateState(id: number, state: string){
        this.ToDoList.forEach((element,index) => {
            if (element.id == id){
                if(state == "Finalizado"){
                    this.ToDoListFinished.push(element);
                    var theJSON = JSON.stringify(this.ToDoListFinished);
                    this.uploadHistorico(theJSON).subscribe((res) => {
                        console.log('Response: ', res);
                    });
                    this.removeToDo(id);
                }else{
                    this.ToDoList[index].state = state;
                    var theJSON = JSON.stringify(this.ToDoList);
                    this.uploadFile(theJSON).subscribe((res) => {
                        console.log('Response: ', res);
                    });
                }
                
            }
        });
        
    }

    noitfyToDoChanges(){
        this.notifyChanges.next(this.ToDoList);
    }
    
    uploadFile(formData){
        let urlApi = 'http://localhost:3000/api/subir';
        return this.httpClient.post(urlApi, formData);
    }
    uploadHistorico(formData){
        let urlApi = 'http://localhost:3000/api/almacenar';
        return this.httpClient.post(urlApi, formData);
    }
}