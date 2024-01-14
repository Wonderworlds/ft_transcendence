import { Injectable } from "@nestjs/common";

@Injectable()
export class Tournament {
	players: string[];
	matchIterator: IterableIterator<string[]>;
    constructor(players) {
        this.players = players;
        this.matchIterator = this.matches();
    }

    *matches() {
        for (let i = 0; i < this.players.length; i += 2) {
            if (i + 1 >= this.players.length) {
                yield [this.players[i]];
                break;
            }
            yield [this.players[i], this.players[i + 1]];
        }
    }

    setNextRoundPlayers(players) {
        this.players = players;
        this.matchIterator = this.matches();
    }

    nextMatch() {
        if (this.players.length < 2) {
            console.log("Tournament Over!");
            return null;
        }

        let match = this.matchIterator.next().value;
		return match
    }
}
