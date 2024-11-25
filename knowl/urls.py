from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add-article/', views.add_article, name='add_article'),
]
