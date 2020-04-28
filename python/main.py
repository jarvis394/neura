import mc
import redis
import json
import sys

client = redis.Redis(host='localhost', port=6379, db=0)
samples = mc.util.load_txt_samples('../data/sample.txt', separator='.')
generator = mc.StringGenerator(
    samples=samples
)

try:
    sub = client.pubsub()
    sub.subscribe('request-channel')
    for message in sub.listen():
        print('MESSAGE:', message)
        if message['type'] == "message":
            data = json.loads(message['data'])

            result = generator.generate_string()
            response = {'result': result, 'id': data['id']}
            client.publish("response-channel", json.dumps(response))
except (KeyboardInterrupt, SystemExit):
    sys.exit()
