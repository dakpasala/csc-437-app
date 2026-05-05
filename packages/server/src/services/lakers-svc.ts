import { LakersData } from "../models/lakers";

const lakersData: { [key: string]: LakersData } = {
    lakers: {
        "Coach": "JJ Redick",
        "Conference" : "Western Conference",
        "Players": [
            
            {
                "player" : "LeBron James", 
                "href" : "player.html"
            },

            {
                "player" : "Luka Doncic"
            },

            {
                "player" : "Austin Reaves"
            },

            {
                "player" : "Marcus Smart"
            },

            {
                "player" : "Luke Kennard"
            },

            {
                "player" : "Deandre Ayton"
            },

            {
                "player" : "Rui Hachimura"
            },

            {
                "player" : "Bronny James"
            },

            {
                "player" : "Jaxson Hayes"
            },

            {
                "player" : "Maxi Kleber"
            },

            {
                "player" : "Jarred Vandervilt"
            },

            {
                "player" : "Adou Thiero"
            },

            {
                "player" : "Drew Timme"
            },

            {
                "player" : "Nick Smith Jr."
            }
            
        ],

        "Games" : [
            {
                "game" : "Lakers vs Celtics",
                "href" : "game.html"
            },

            {
                "game" : "Lakers @ Thunder"
            },

            {
                "game" : "Lakers @ Wizards"
            },

            {
                "game" : "Lakers vs Wolves"
            },

            {
                "game" : "Lakers @Knicks"
            },

            {
                "game" : "Lakers vs Hawks"
            }
        ],

        "Championships" : [
            {   
                "championship" : "2019-2020",
                "href" : "chip.html"
            },

            {
                "championship" : "2009-2010"
            },

            {
                "championship" : "2008-2009"
            },

            {
                "championship" : "2001-2002"
            },

            {
                "championship" : "2000-2001"
            },

            {
                "championship" : "1999-2000"
            }
        ]
    }
};

function get(id: string): LakersData | undefined {
    return lakersData[id];
}

export default { get };