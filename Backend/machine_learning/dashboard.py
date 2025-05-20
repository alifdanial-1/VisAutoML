from explainerdashboard import ExplainerDashboard
import sys
import joblib
import os

def runModel(filename):
    # model = joblib.load('model.joblib')
    # os.system("sudo kill -9 $(lsof -t -i:8050)")
    # os.system("explainerdashboard run explainer.joblib")
    # os.system('explainerdashboard run '+filename+'.joblib')
    db = ExplainerDashboard.from_config(filename+".yaml")
    app = db.flask_server()
    os.system("gunicorn -w 4 -b http://52.221.176.156:8050 app:app")
