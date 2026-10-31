from django.urls import path
from . import views

urlpatterns = [
    path('activities/', views.activities_list),
    path('activities/<int:id>/', views.delete_activity),
    path('summary/', views.summary),
]