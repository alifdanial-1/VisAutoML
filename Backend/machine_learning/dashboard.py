from explainerdashboard import ExplainerDashboard
import sys
import joblib
import os

def runModel(filename):
    # model = joblib.load('model.joblib')
    os.system("npx kill-port 8050")
    os.system("explainerdashboard run explainer.joblib --port 8050 --host 0.0.0.0 &")

    # os.system('explainerdashboard run '+filename+'.joblib')
