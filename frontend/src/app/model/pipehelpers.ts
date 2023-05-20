import {Pipe, PipeTransform} from '@angular/core';
import { HorseForm} from './horse';

@Pipe ({
    name : 'formstring'
})
export class FormStringPipe implements PipeTransform {
    transform(val: number): string {
        return val == HorseForm.BAD ? 'Bad' : val == HorseForm.AVERAGE ? 'Average' : 'Good';
    }
}

@Pipe ({
    name : 'racedifficulty'
})
export class RaceDifficultyPipe implements PipeTransform {
    transform(val: number): string {
        return val == 9 ? 'World Class' : val == 5 ? 'Top' : val == 3 ? 'Medium' : 'Easy' ;
    }
}
