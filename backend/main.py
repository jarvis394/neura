import mc
import redis
import json
import sys

client = redis.Redis(host='localhost', port=6379, db=0)
print('Running Python backend')

try:
    sub = client.pubsub()
    sub.subscribe('request-channel')
    for message in sub.listen():
        if message['type'] == "message":
            data = json.loads(message['data'])
            print('MESSAGE:', data['id'])
            generator = mc.StringGenerator(
                samples=data['samples']
            )
            result = generator.generate_string()
            response = {'result': result, 'id': data['id']}
            client.publish("response-channel", json.dumps(response))
except (KeyboardInterrupt, SystemExit):
    sys.exit()
