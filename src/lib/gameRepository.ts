import { type Game } from "../types/types";

export class GameRepository {
    private games: Game[];
    
    constructor() {
        this.games = [];
    }

    getGame(code: string) {
        return this.games.find(game => game.code === code)
    }

    saveGame(game: Game) {
        const index = this.games.findIndex(g => g.code === game.code);
        if(index !== -1) {
            this.games[index] = game;
        } else {
            this.games.push(game);
        }
    }
}

export const gameRepository = new GameRepository();
