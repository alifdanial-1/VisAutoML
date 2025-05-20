from explainerdashboard import ExplainerDashboard
import sys
import joblib
import os

def runModel(filename):
    # model = joblib.load('model.joblib')
    os.system("sudo kill -9 $(lsof -t -i:8050)")
    os.system("explainerdashboard run explainer.joblib")

    # os.system('explainerdashboard run '+filename+'.joblib')
