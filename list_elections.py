import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('voting-elections')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        response = table.scan()
        elections = response.get('Items', [])
        formatted_elections = []
        for e in elections:
            formatted_elections.append({
                'election_id': e.get('election_id', ''),
                'election_name': e.get('election_name', ''),
                'description': e.get('description', ''),
                'status': e.get('status', 'draft'),
                'election_start_time': e.get('election_start_time', ''),
                'election_end_time': e.get('election_end_time', ''),
                'total_voters': int(e.get('total_voters', 0)) if e.get('total_voters') else 0,
                'votes_cast': int(e.get('votes_cast', 0)) if e.get('votes_cast') else 0
            })
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'elections': formatted_elections}, cls=DecimalEncoder)
        }
    except Exception as ex:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(ex)})
        }
