## Inspiration

Looking for an empty meeting room is a zero sum game of musical chairs. People are always poaching empty rooms or overbooking for the time they need.

## What it does

Jarvis Office uses AI and Calendar integration to tell you which rooms are currently available for a meeting. If a room is booked, but has nobody in it, Jarvis Office lets you rebook it under your name.
Besides, if a room is available but has people in it, Jarvis Office let's you know about it before you make any bookings.

And of course, it has the basic room booking functionality, too.

Here is how it works:

There are cameras installed in each room, which take pictures every given interval (e.g. 5 mins) and upload those images into AWS S3. Once an image is uploaded, a Lambda trigger analyzes the image to determine if there are people in the room, and update the room status in a calendar, which is currently stored in DynamoDB.
When you ask Alexa to book a room, Alexa makes an informed decision, taking into consideration the room availability and emptiness.

## How we built it

We built Jarvis Office using the following AWS services:
 - S3
 - Rekognition
 - Lambda
 - DynamoDB

## Challenges we ran into

The main challenge was to finish the task within the given time constrains.

## Accomplishments that we're proud of

This is not a simple calendar assistant, but a smart one!

## What we learned



## What's next for JarvisOffice

 - automating image capture and upload
 - integration with different calendars (e.g. Google Calendar, iCal, Office 365)
 - face recognition? or at least the number of people in the room.