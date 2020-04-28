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
        if message['type'] == "message":
            print('MESSAGE:', message['data'])
            data = json.loads(message['data'])
            mc_result = generator.generate_string()
            response = str(data['id']) + str(data['channelID']) + mc_result
            client.publish("response-channel", response)
except (KeyboardInterrupt, SystemExit):
    sys.exit()
