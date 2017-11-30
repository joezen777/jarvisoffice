/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.51ec2a8f-6895-46e1-8eef-90d09c0b539d'; // TODO replace with your app ID (OPTIONAL).

const rooms = [
    {
        "booking": [
            {
                "from": 1512034136,
                "person": "Dun",
                "to": 1512037736
            }
        ],
        "capacity": 5,
        "location": "floor 2",
        "room_name": "mirage"
    },
    {
        "booking": [
            {
                "from": 1512041400,
                "person": "Joe",
                "to": 1512043200
            },
            {
                "from": 1512043200,
                "person": "Mary",
                "to": 1512046800
            }
        ],
        "capacity": 4,
        "location": "floor 2",
        "room_name": "venetian"
    }
]


const languageStrings = {
    'en': {
        translation: {
            BOOKINGS: rooms,
            SKILL_NAME: 'Jarvis Office',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, book a room, book a meeting ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Meetings %s.',
            HELP_MESSAGE: "You can ask questions such as, what rooms are available, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, who is in the mirage room, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            BOOKING_REPEAT_MESSAGE: 'Try saying repeat.',
            BOOKING_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            BOOKING_NOT_FOUND_WITH_ITEM_NAME: 'the booking for %s. ',
            BOOKING_NOT_FOUND_WITHOUT_ITEM_NAME: 'that booking. ',
            BOOKING_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            BOOKINGS: rooms,
            SKILL_NAME: 'Jarvis Office',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'JO_BookingIntent': function () {
        /*const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }*/
        
        let requestLocale = this.event.request.locale; //get locale from request for our DB secondary index
let AWS = require('aws-sdk'); //instantiate the aws sdk
let docClient = new AWS.DynamoDB.DocumentClient(); // create a DynamoDB client
let params = { // Parameters object for a query that will return all facts for a locale
  TableName : "calendar",
  IndexName: "locale-index",
  KeyConditionExpression: "locale = :v1",
  ExpressionAttributeValues: {
    ":v1": requestLocale
  }
};

let dynamoQuery = docClient.query(params).promise();//create the query and wrap in a promise
dynamoQuery.then(fulfilled.bind(this), rejected.bind(this));//execute query asynchronously

function fulfilled(value) {//function for handling a fulfilled promise
  console.log(value);
  const rooms = value.Items;
  
  


        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), '');
        //const rooms = this.t('BOOKINGS');

        var speechOutput = "";
        var unbookedOpenRooms = [];
        var bookedOpenRooms = [];
        for (var i = 0; i < rooms.length; i++){
            var booked = false;
            /*
            for (var j = 0; j < rooms[i].booking.length; j++){
                var now = new Date();
                var from = new Date(rooms[i].booking[j].from);
                var to = new Date(rooms[i].booking[j].to);
                if (now >= from && now < to) {
                    booked = true;
                    break;
                }
            }*/
            booked = rooms[i].booking && rooms[i].booking.length > 0;
            var empty = rooms[i].empty;
            if (booked === false && empty === true) {
                unbookedOpenRooms.push(rooms[i].room_name);
            }
            else if (empty === true) {
                bookedOpenRooms.push(rooms[i].room_name);
            }
        }
        var good = false;
        if (bookedOpenRooms.length === 0 && unbookedOpenRooms.length === 0) {
            speechOutput = "No rooms are available right now.";
        }
        else if (unbookedOpenRooms.length > 0) {
            for (var i = 0; i < unbookedOpenRooms.length; i++){
            speechOutput = unbookedOpenRooms[i] + " is currently available. Would you like to book the room?";
            }
        }
        else {
            for (var i = 0; i < bookedOpenRooms.length; i++){
            speechOutput = bookedOpenRooms[i] + " is currently booked but empty. Squatter's rights. Take the room.";
            }
        }

        this.emit(':tell', speechOutput);
        
};
function rejected(reason) {//function for handling a rejected promise
  console.log(reason);
  this.emit(':tell', "An Error occurred, please check the console log");
};
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
