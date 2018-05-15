import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'formstring'
})
export class FormStringPipe implements PipeTransform {
   transform(val : number) : string {
      return val == 10 ? "Bad" : val == 11 ? "Average" : "Good";
   }
}

@Pipe ({
    name : 'racedifficulty'
 })
 export class RaceDifficultyPipe implements PipeTransform {
    transform(val : number) : string {
       return val == 9 ? "World Class" : val == 5 ? "Top" : val == 3 ? "Medium" : "Easy" ;
    }
 }