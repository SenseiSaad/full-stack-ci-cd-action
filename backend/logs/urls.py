from django.urls import path
from . import views

urlpatterns = [
    path('logs/', views.log_list, name='log_list'),
    path('logs/create/', views.log_create, name='log_create'),
    path('logs/<int:id>/', views.log_detail, name='log_detail'),
    path('logs/<int:id>/update/', views.log_update, name='log_update'),
    path('logs/<int:id>/delete/', views.log_delete, name='log_delete'),
]
