from django.urls import path
from . import views

urlpatterns=[
    path('experience/', views.experience_list, name='experience_list'),
    path('experience/create/', views.experience_create, name='experience_create'),
    path('experience/<int:id>/', views.experience_one, name='experience_one'),
    path('experience/<int:id>/update/', views.experience_update, name='experience_update'),
    path('experience/<int:id>/delete/', views.experience_delete, name='experience_delete'),
]