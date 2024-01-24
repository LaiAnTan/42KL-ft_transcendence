from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('send/', views.sendData),
    path('user/<username>', views.getUserData)
]
