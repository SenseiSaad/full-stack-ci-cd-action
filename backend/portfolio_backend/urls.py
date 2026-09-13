from django.contrib import admin
from django.urls import path
from portfolio_api.views import portfolio, messages

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/portfolio/', portfolio),
    path('api/messages/', messages),
]