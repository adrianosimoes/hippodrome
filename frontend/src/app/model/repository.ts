import { Player } from './player';
import { Horse } from './horse';

export let playerOne: Player = new Player();

export const HORSES_IN_SHOP: Horse[] = [
    {
        id: 1,
        name: 'Mayana Bolt',
        speed: 11,
        stamina: 20,
        price: 4000,
        owned: false
    },
    {
        id: 2,
        name: 'Elmer Steel',
        speed: 8,
        stamina: 25,
        price: 4000,
        owned: false
    },
    {
        id: 3,
        name: 'Caspian Grey',
        speed: 15,
        stamina: 14,
        price: 4000,
        owned: false
    },
    {
        id: 4,
        name: 'Scarlett Diamond',
        speed: 14,
        stamina: 20,
        price: 4500,
        owned: false
    },
    {
        id: 5,
        name: 'Aeria King',
        speed: 11,
        stamina: 25,
        price: 4500,
        owned: false
    }
];