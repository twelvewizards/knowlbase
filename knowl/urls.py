from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add-article/', views.add_article, name='add_article'),
    path('login/', views.user_login, name='user_login'),
    path('signup/', views.signup, name='signup'),
    path('logout/', views.user_logout, name='user_logout'),path('fetch-users/', views.fetch_users, name='fetch_users'),
    path("update-user/", views.update_user, name="update_user"),
    path("delete-user/", views.delete_user, name="delete_user"),
    path('get-categories/', views.get_categories, name='get_categories'),
    path('get-types/<int:category_id>/', views.get_types, name='get_types'),
    path('delete-article/', views.delete_article, name='delete_article'),
]
