from django.urls import path
from . import views

# Define all URLs for messages app
urlpatterns = [
    # GET all messages
    path('messages/', views.message_list, name='message_list'),
    # POST new message (create)
    path('messages/create/', views.message_create, name='message_create'),
    # GET one message by ID
    path('messages/<int:id>/', views.message_detail, name='message_detail'),
    # DELETE one message by ID
    path('messages/<int:id>/delete/', views.message_delete, name='message_delete'),
]
