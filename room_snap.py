from __future__ import print_function

import json
import urllib
import boto3

print('Snapshot uploaded')

s3 = boto3.client('s3')
dynamo = boto3.client('dynamodb')
rekognition = boto3.client('rekognition')


def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))

    # Get the upload information
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.unquote_plus(event['Records'][0]['s3']['object']['key'].encode('utf8'))

    room = key.split('/')[1]
    print("room: %s" % room)
    empty = detect_person(bucket, key)
    print("empty: %s" % empty)

    update_calendar(room=room, empty=empty)


def update_calendar(room, empty):
    try:
        dynamo.update_item(TableName='calendar', Key={'room_name':{'S': room}},
                           AttributeUpdates={'empty': {'Value': {'BOOL': empty}}})
    except Exception as e:
        print(e)
        raise e


def detect_person(bucket, key):
    try:

        labels = rekognition.detect_labels(Image={'S3Object': {'Bucket': bucket, 'Name': key}},
                                           MaxLabels=10)
        for label in [label for label in labels['Labels'] if label['Name'] == 'Person' and label[
            'Confidence'] >= 90]:
            return False
        return True
    except Exception as e:
        print(e)
        raise e