import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Race } from '../../model/race';
import { Horse, getRandomInt} from '../../model/horse';
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
    horses: Horse[];
    playerHorse: Horse;
    playerColor: string;

    constructor(private activeRoute: ActivatedRoute, private commonService: CommonService) { }

    ngOnInit() {
        this.horses = [];
        this.raceId = this.activeRoute.snapshot.params['id'];
        this.currRace = this.commonService.getRace(this.raceId);
        this.horses[0] = this.commonService.getPlayer().horses[0];
        this.playerHorse = this.horses[0];
        this.playerColor = this.commonService.getPlayer().color;

        for (let i = 1; i < 6; i++) {
            this.horses[i] = this.commonService.createRandomHorse(i);
        }

        this.commonService.randomizeArray(this.horses);
        setTimeout(() => { this.startRace() }, 50);
    }

    startRace(): void {
        for (let i = 0; i < 6; i++) {
            if (this.horses[i] === this.playerHorse) {
                $('#silk' + (i + 1) + ' .silk').css('background', this.playerColor);
            } else {
                $('#silk' + (i + 1) + ' .silk').css('background', '#fff');
            }
        }

        setTimeout(() => { this.updateRace() }, 500);
    }

    updateRace(): void {
        let allFinished: boolean = true;
        for (let i = 0; i < 6; i++) {
            if ($('#silk' + (i + 1)).position().left > $(".raceStadium").position().left + $(".raceStadium").width() - 5) {
                continue;
            } else {
                allFinished = false;
            }
            $('#silk' + (i + 1)).css('left', '+=' + getRandomInt(0, this.horses[i].speed / 4));
        }
        if (allFinished) {
            return;
        }
        setTimeout(() => { this.updateRace() }, 30);
    }
}
