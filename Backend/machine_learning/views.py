import os
import traceback
import threading

from rest_framework import viewsets, status, decorators, views
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render
from django.http import JsonResponse
from multiprocessing import Process
import threading
import pandas as pd
import os
import signal


from .serializers import ModelSerializer, ModelDescriptionSerializer
from .models import Model, ModelDescription
from .review import get_review
from .regression_custom_explainer import finishing
from explainerdashboard import ExplainerDashboard
# from .dashboard import runModel

# Global variable to keep track of the dashboard thread
dashboard_thread = None
dashboard_process = None

def index(request):
    # print(request)
    # return request
    return render(request, "machine_learning/index.html")

def dashboard(request, pk):
    print("dashboard >>")

    # Kill any existing dashboard process
    kill_existing_dashboard()
    
    # Launch new dashboard
    launch_dashboard(pk)
    
    return "Success"

def kill_existing_dashboard():
    """Kill any existing dashboard process or thread"""
    global dashboard_thread, dashboard_process
    
    # Kill any process on port 8050
    os.system("npx kill-port 8050")
    
    # If there's an active dashboard thread, try to stop it
    if dashboard_thread and dashboard_thread.is_alive():
        # We can't really stop a thread, but for future implementation
        # we could use event flags to signal the thread to stop
        pass
    
    # If there's an active dashboard process, try to stop it
    if dashboard_process:
        try:
            os.kill(dashboard_process.pid, signal.SIGTERM)
            dashboard_process = None
        except:
            pass

def launch_dashboard(model_id):
    """Launch the dashboard in a daemon thread using Waitress"""
    global dashboard_thread
    
    # Load the explainer configuration from the saved YAML file
    filename = str(model_id)
    
    def run_dashboard():
        try:
            db = ExplainerDashboard.from_config(filename + ".yaml")
            print(f"Starting dashboard for model {model_id} on port 8050")
            db.run(port=8050, use_waitress=True, mode='external')
        except Exception as e:
            print(f"Error launching dashboard: {str(e)}")
            traceback.print_exc()
    
    # Start the dashboard in a daemon thread
    dashboard_thread = threading.Thread(target=run_dashboard, daemon=True)
    dashboard_thread.start()

# @api_view(['POST'])
# def chatbot_response(request):
#     user_input = request.data.get('question')

#     # Make sure to handle exceptions and errors appropriately

#     response = openai.Completion.create(
#       engine="text-davinci-003",
#       prompt=user_input,
#       max_tokens=150
#     )

#     return JsonResponse({'response': response.choices[0].text})




class ModelViewSet(viewsets.ViewSet):

    def list(self, request):
        models = Model.objects.all().order_by('-id')
        print("Getting models >>>",models)
        serializer = ModelSerializer(models, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            serializer = ModelSerializer(data=request.data)
            if serializer.is_valid():
                print("saving....", request.data)
                model = serializer.save()
                global saved_id
                saved_id = model.id
                print("Saved --------")
                result = get_review(model.data_set.path)
                
                description = ModelDescription.objects.create(
                    model=model, description={})
                description_serializer = ModelDescriptionSerializer(description)
                
                # about_to_finish = finishing()
                # print(about_to_finish)

                return Response(
                    {"response": result, 
                     "model": serializer.data, 
                     "description": description_serializer.data
                     })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            traceback.print_exc()

    def destroy(self, request, pk):
        Model.objects.get(id=pk).delete()
        models = Model.objects.all().order_by('-id')
        serializer = ModelSerializer(models, many=True)
        return Response(serializer.data)
    
    def open(self, request, pk):
        print("dashboard >>>>>", pk)
        
        # Kill any existing dashboard
        kill_existing_dashboard()
        
        # Launch new dashboard
        launch_dashboard(pk)
        
        return Response({"response":"Success", "url": "http://52.221.176.156:8050"})


class ModelDescriptionViewSet(viewsets.ViewSet):

    def update(self, request, pk):
        description = ModelDescription.objects.get(id=pk)
        serializer = ModelDescriptionSerializer(description, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FlaskModelViewSet(viewsets.ViewSet):
    # {"model": 12, "id_column": "Survived", "prediction_column": "PassengerId", "not_to_use_columns": ["Name"],
    #        "projectTitle": "test", "algo": "", "auto": 1, "unit": "", "description": 12}
    def list(self, request):
        models = Model.objects.all().order_by('-id')
        for each_item in models:
            if each_item.model_type == "RG":
                each_item.model_type = "Regression"
            else:
                each_item.model_type = "Classification"
        serializer = ModelSerializer(models, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            model_obj = Model.objects.get(id=request.data["model"])
            model_id = request.data["model"]
            model = model_obj.model_type
            description_obj = ModelDescription.objects.get(id=request.data["description"])
            train_csv_path = model_obj.data_set
            project_title = request.data["projectTitle"]
            auto = request.data["auto"]
            algo = request.data["algo"]
            model_obj.algorithm_name = algo
            model_obj.save()
            if algo == "":
                algo = "auto"
            if request.data["id_column"] == "":
                id_column = "null"
            else:
                id_column = request.data["id_column"]
            if request.data["prediction_column"] == "":
                predict = "null"
            else:
                predict = request.data["prediction_column"]
            if request.data["not_to_use_columns"]:
                drop = request.data["not_to_use_columns"]
            else:
                drop = ["null"]

            descriptions = description_obj.description
            unit = "null"
            label0 = "null"
            label1 = "null"
            split = "null"
            if "unit" in request.data:
                if request.data["unit"] != "":
                    unit = request.data["unit"]
            if "label0" in request.data:
                if request.data["label0"] != "":
                    label0 = request.data["label0"]
            if "label1" in request.data:
                if request.data["label1"] != "":
                    label1 = request.data["label1"]
            if "split" in request.data:
                if request.data["split"] != "":
                    split = request.data["split"]
            print(request.data)

            # Kill any existing dashboard process
            kill_existing_dashboard()
            
            global dashboard_process
            # For Windows, use a separate process that can be terminated
            dashboard_process = threading.Thread(target=self.run,
                               args=(
                                   train_csv_path, project_title, auto, id_column, predict, drop, descriptions, algo,
                                   model_id, model, unit, label0, label1, split))
            dashboard_process.daemon = True
            dashboard_process.start()
            
            # After the training is complete, launch the dashboard
            return Response(data={"message": "Model training started. The dashboard will be available at http://52.221.176.156:8050 when training is complete."}, 
                          status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return Response(data={"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def run(self, train_csv_path, project_title, auto, id_column, predict, drop, descriptions, algo, model_id, model,
            unit, label0, label1, split):
        """Run the model training process and then launch the dashboard"""
        try:
            # Kill any existing process on port 8050
            os.system("npx kill-port 8050")
            
            # Run the appropriate custom explainer script
            if model in ['CL']:
                print("Running classifier explainer")
                cmd = (
                    f'python machine_learning/classifier_custom_explainer.py '
                    f'{train_csv_path} "{project_title}" {auto} "{id_column}" "{predict}" '
                    f'"{drop}" "{descriptions}" {algo} {model_id} "{label0}" "{label1}" "{split}"'
                )
                exit_code = os.system(cmd)
            else:
                print("Running regression explainer")
                cmd = (
                    f'python machine_learning/regression_custom_explainer.py '
                    f'{train_csv_path} "{project_title}" {auto} "{id_column}" "{predict}" '
                    f'"{drop}" "{descriptions}" {algo} {model_id} "{unit}" "{split}"'
                )
                exit_code = os.system(cmd)
            
            if exit_code != 0:
                print(f"Error: Script exited with code {exit_code}")
                return
            
            # Launch the dashboard after training is complete
            launch_dashboard(model_id)
        except Exception as e:
            print(f"Error in run method: {str(e)}")
            traceback.print_exc()
