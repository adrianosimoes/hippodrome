import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Race } from '../../model/race';
import { Horse, HorseInRace, getRandomInt} from '../../model/horse';
import { CommonService } from '../../model/common.service';


declare var $: any;

@Component({
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.css']
})
export class RaceComponent implements OnInit {
    raceId: number;
    currRace: Race;
    horses: HorseInRace[];
    sortedHorses: HorseInRace[];
    playerHorse: HorseInRace;
    raceStart: Date;
    raceTimer: number;
    preRace: boolean = true;

    constructor(private activeRoute: ActivatedRoute, private commonService: CommonService) { }

    ngOnInit() {
        this.horses = [];
        this.raceId = this.activeRoute.snapshot.params['id'];
        this.currRace = this.commonService.getRace(this.raceId);
        this.horses[0] = new HorseInRace(this.commonService.getPlayer().horses[0], this.commonService.getPlayer().color);
        this.playerHorse = this.horses[0];

        for (let i = 1; i < 6; i++) {
            this.horses[i] = new HorseInRace(this.commonService.createRandomHorse(i, this.raceId), this.commonService.createRandomColor());
        }

        this.commonService.randomizeArray(this.horses);
        this.sortedHorses = this.horses.slice();
    }

    startRace(): void {
        this.preRace = false;
        this.raceTimer = 0;

        this.raceStart = new Date();
        setTimeout(() => { this.updateRace() }, 30);
    }

    updateRace(): void {
        let allFinished: boolean = true;
        let maxDistance = this.currRace.distance;
        for (let i = 0; i < 6; i++) {
            if ($('#horse' + (i + 1)).position().left >= $(".raceStadium").position().left + $(".raceStadium").width() - 5) {
                continue;
            } else {
                allFinished = false;
            }
            let step = getRandomInt(0, this.horses[i].speed / 4);
            $('#horse' + (i + 1)).css('left', '+=' + step);

            this.horses[i].distanceDone += step;
            if (this.horses[i].distanceDone > maxDistance) {
                this.horses[i].distanceDone = maxDistance;
            }
        }

        this.commonService.stableSort(this.sortedHorses, (h1, h2) => h2.distanceDone - h1.distanceDone);

        this.raceTimer = (new Date().getTime() - this.raceStart.getTime()) / 1000;

        if (allFinished) {
            return;
        }
        setTimeout(() => { this.updateRace() }, 30);
    }
}
