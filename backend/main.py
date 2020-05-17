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
      try:
        result = generator.generate_string(
          attempts=100,
          validator=mc.validators.words_count(minimal=1, maximal=15),
          formatter=mc.formatters.usual_syntax,
        )
        response = {'result': result, 'id': data['id']}
        client.publish("response-channel", json.dumps(response))
      except:
        client.publish("response-channel", json.dumps({'result': 'error', 'id': data['id']}))
except (KeyboardInterrupt, SystemExit):
  sys.exit()
