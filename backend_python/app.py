from flask import Flask
from flask_cors import CORS
from api.sum import sum_bp
from api.workerPickingUpload import workerPickingUpload_bp


app = Flask(__name__)

# ✅ Correct CORS config
CORS(
    app,
    origins=["http://localhost:5173"],  # your React dev server
    supports_credentials=True           # allows cookies, sessions
)

# Register blueprint
app.register_blueprint(sum_bp, url_prefix='/api')
app.register_blueprint(workerPickingUpload_bp, url_prefix='/api')
app.register_blueprint(filterWorkerController_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
