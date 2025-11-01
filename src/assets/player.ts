import { PlayerProprety } from "./types";

export class Player {
    public id: string;
    public username: string;
    public icon: number;

    public position: number;
    public balance: number;
    public properties: Array<PlayerProprety>;
    public isInJail: boolean;
    public jailTurnsRemaining: number;
    public getoutCards: number;
    public ready: boolean;
    public positions: { x: number; y: number };
    constructor(_id: string, _name: string) {
        this.id = _id;
        this.username = _name;
        this.icon = -1;
        this.position = 0;
        this.balance = 1500;
        this.properties = [];
        this.isInJail = false;
        this.jailTurnsRemaining = 0;
        this.getoutCards = 0;
        this.ready = false;
        this.positions = { x: 0, y: 0 };
    }
    recieveJson(json: PlayerJSON) {
        this.username = json.username;
        this.position = json.position;
        this.icon = json.icon;
        this.balance = json.balance;
        this.properties = json.properties;
        this.isInJail = json.isInJail;
        this.jailTurnsRemaining = json.jailTurnsRemaining;
        this.getoutCards = json.getoutCards;
        return this;
    }

    public toJson() {
        return {
            balance: this.balance,
            icon: this.icon,
            id: this.id,
            isInJail: this.isInJail,
            jailTurnsRemaining: this.jailTurnsRemaining,
            position: this.position,
            properties: this.properties,
            username: this.username,
            getoutCards: this.getoutCards,
        } as PlayerJSON;
    }

    get color() {
        switch (this.icon) {
            case 1:
                return "#4169e1"; // Royal Blue
            case 2:
                return "#50C878"; // Emerald Green
            case 3:
                return "#FFC000"; // Golden Yellow
            case 4:
                return "#9B59B6"; // Purple
            case 5:
                return "#FF7F50"; // Coral Orange
            case 6:
                return "#E0115F"; // Ruby Red
            default:
                return "#4169e1"; // Default to Blue
        }
    }
}
export type PlayerJSON = {
    id: string;
    username: string;
    icon: number;
    position: number;
    balance: number;
    properties: Array<any>;
    isInJail: boolean;
    jailTurnsRemaining: number;
    getoutCards: number;
};
