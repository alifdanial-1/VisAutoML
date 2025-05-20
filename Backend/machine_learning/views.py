import os
import traceback

from rest_framework import viewsets, status, decorators, views
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from multiprocessing import Process
import threading
import pandas as pd
import os


from .serializers import ModelSerializer, ModelDescriptionSerializer
from .models import Model, ModelDescription
from .review import get_review
from .regression_custom_explainer import finishing
from .dashboard import create_dashboard_app

def index(request):
    # print(request)
    # return request
    return render(request, "machine_learning/index.html")

def dashboard(request, model_id):
    """
    Serve the ExplainerDashboard for a specific model directly within Django
    """
    try:
        # Get the flask app for the dashboard
        flask_app = create_dashboard_app(model_id)
        
        # Create a WSGI middleware that dispatches to the Flask app
        from werkzeug.middleware.dispatcher import DispatcherMiddleware
        from werkzeug.wrappers import Response
        
        # Create a simple WSGI app that just returns 404
        def not_found(environ, start_response):
            response = Response('Not Found', status=404)
            return response(environ, start_response)
        
        # Create the dispatch middleware, mounting the Flask app at root
        app = DispatcherMiddleware(not_found, {
            '': flask_app.wsgi_app
        })
        
        # Call the middleware with the Django request WSGI environment
        def start_response(status, headers):
            response = HttpResponse()
            status_code = int(status.split(' ')[0])
            response.status_code = status_code
            for header, value in headers:
                response[header] = value
            return response.write
        
        # Get the result from the Flask app
        result = app(request.environ, start_response)
        
        # Create a Django HttpResponse from the Flask response
        response = HttpResponse(b''.join(result))
        
        return response
    except Exception as e:
        traceback.print_exc()
        return HttpResponse(f"Error loading dashboard: {str(e)}", status=500)

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
        """
        API endpoint to notify that a dashboard should be accessible.
        This no longer launches a separate process but just confirms the model exists.
        """
        try:
            model = Model.objects.get(id=pk)
            # Just verify the model exists, the actual dashboard is served by the dashboard view
            return Response({"response": "Success", "url": f"/dashboard/{pk}/"})
        except Model.DoesNotExist:
            return Response({"response": "Model not found"}, status=404)
        except Exception as e:
            traceback.print_exc()
            return Response({"response": f"Error: {str(e)}"}, status=500)


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
            # linux
            # p = Process(target=self.run,
            #                      args=(
            #                          train_csv_path, project_title, auto, id_column, predict, drop, descriptions, algo,
            #                          model_id,
            #                          model, unit, label0, label1))

            # windows
            p = threading.Thread(target=self.run,
                                 args=(
                                     train_csv_path, project_title, auto, id_column, predict, drop, descriptions, algo,
                                     model_id,
                                     model, unit, label0, label1, split))
            print("thread+++++++++++")
            p.start()
            p.join()
            return Response(data={"message": "success"}, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()

    def run(self, train_csv_path, project_title, auto, id_column, predict, drop, descriptions, algo, model_id, model,
            unit, label0, label1, split):
        ""
        # No need to kill port 8050 anymore since we're serving within Django
        print("Model id >>", model_id)
        if model in ['CL']:
            print("view--------------------")
            os.system(
                'python machine_learning/classifier_custom_explainer.py ' + str(
                    train_csv_path) + ' ' +'"'+ project_title +'"'+ ' ' + str(
                    auto) + ' ' +'"'+ id_column +'"'+ ' ' +'"'+ predict +'"'+ ' ' + '"' + str(drop) + '"' + ' ' +'"'+ str(
                    descriptions) +'"'+ ' ' + str(algo) + ' ' + str(model_id) + ' ' +'"'+ str(label0) +'"'+ ' ' +'"'+ str(label1) +'"'+ ' ' + '"' + str(split) + '"')
            print("end+++++++++++")
        else:
            os.system(
                'python machine_learning/regression_custom_explainer.py ' + str(
                    train_csv_path) + ' ' +'"'+ project_title +'"'+ ' ' + str(
                    auto) + ' ' +'"'+ id_column +'"'+ ' ' +'"'+ predict +'"'+ ' ' + '"' + str(drop) + '"' + ' ' +'"'+ str(
                    descriptions) +'"'+ ' ' + str(algo) + ' ' + str(model_id) + ' ' +'"'+ str(unit) +'"'+ ' ' + '"' + str(split) + '"')
