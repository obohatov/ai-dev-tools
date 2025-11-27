from django.urls import path
from . import views

urlpatterns = [
    path('', views.todo_list, name='todo_list'),
    path('todo/<int:pk>/edit/', views.todo_edit, name='todo_edit'),
    path('todo/<int:pk>/delete/', views.todo_delete, name='todo_delete'),
    path('todo/<int:pk>/toggle/', views.todo_toggle_complete, name='todo_toggle'),
]
