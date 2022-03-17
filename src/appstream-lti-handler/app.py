import os, boto3
from chalice import Chalice, Response
from pylti.chalice import lti
from urllib.parse import parse_qs

app = Chalice(app_name='appstream-lab')

@app.route('/', methods=['POST'], content_types=['application/x-www-form-urlencoded'])
@lti(request='initial', app=app)
def index(lti=lti):
    client = boto3.client('appstream')
    params = parse_qs(app.current_request.raw_body.decode())
    response = client.create_streaming_url(
        StackName=params['custom_stack'][0],
        FleetName=params['custom_fleet'][0],
        UserId=lti.name
    )
    print(lti.name)
    url = response['StreamingURL']
    body = "<p><a href='%s'>If you are not automatically redirected, click here.</a></p>" % url
    return Response(body=body, status_code=301, headers={'Location': url})