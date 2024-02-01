from django.urls import path
from . import views

urlpatterns = [
    path('addUser/', views.addUser),
    path('user/<username>', views.getUser),
    path('allUsers/', views.getAllUsers),
]
