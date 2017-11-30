## Inspiration

Looking for an empty meeting room is a zero sum game of musical chairs. People are always poaching empty rooms or overbooking more time than they really need.

## What it does

Jarvis Office uses AI and Calendar integration to tell you which rooms are currently available for a meeting. If a room is booked, but has nobody in it, Jarvis Office lets you rebook it under your name. If a room is available but has people in it, Jarvis Office lets you know about it before you make any bookings.

Here is how it works:

There are cameras installed in each room, which take pictures during a designated time interval (e.g. 5 mins), which are uploaded into S3. Once an image is uploaded, a Lambda trigger analyzes the image to determine if there are people in the room. It updates the room status in a calendar, which is currently stored in DynamoDB. 
When you ask Alexa to book a room, Alexa makes an informed decision, taking into consideration the room availability and its emptiness.

## How we built it

We built Jarvis Office using the following AWS services:
 - S3
 - Rekognition
 - Lambda
 - DynamoDB
 - Alexa

## Challenges we ran into

The main challenge was to finish the task within the given time constraints. We first wanted to add facial catalog recognition but realized that detect labels was a better Rekognition service to use for privacy and not having to worry about cropping and zooming on faces.

## Accomplishments that we're proud of

This is not a simple calendar assistant, but a smart one! The S3 integration and automatic updating of DynamoDb is freaking awesome.

## What we learned

You don't have to get super high tech with incorporating vision analysis, Detecting Objects in Rekognition can suffice for many common use cases.  Very easy to build a fast prototype.

## What's next for JarvisOffice

 - automating image capture and upload
 - integration with different calendars (e.g. Google Calendar, iCal, Office 365)
 - face recognition? or at least the number of people in the room.
 - live video stream analysis
 - integration with ALEXA FOR BUSINESS!! (Build a separate skillset for each office location and integrate with AWS Beacon detection in addition to visual analysis.)