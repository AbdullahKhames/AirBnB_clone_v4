#!/usr/bin/python3
"""Flask App Module"""

from api.v1.views import app_views
from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger
from flasgger.utils import swag_from
from models import storage
from os import getenv

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
CORS(app, resources={r"/api/v1/*": {"origins": "*"}})
app.register_blueprint(app_views)


@app.teardown_appcontext
def teardown_db(err):
    """After each request you must remove the current Session"""
    storage.close()


@app.errorhandler(404)
def not_found(err):
    """handler for 404 errors that returns a JSON-formatted"""
    return jsonify({"error": "Not found"}), 404

app.config['SWAGGER'] = {
    'title': 'AirBnB clone Restful API',
    'uiversion': 3
}

Swagger(app)

if __name__ == '__main__':
    host = getenv('HBNB_API_HOST', '0.0.0.0')
    port = getenv('HBNB_API_PORT', '5000')
    app.run(host=host, port=int(port), threaded=True)
