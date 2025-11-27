from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from .models import Todo


def todo_list(request):
    todos = Todo.objects.order_by('is_completed', 'due_date')
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        due_date = request.POST.get('due_date') or None

        if title:
            Todo.objects.create(
                title=title,
                description=description,
                due_date=due_date,
            )
        return redirect('todo_list')

    return render(request, 'home.html', {'todos': todos})


def todo_edit(request, pk):
    todo = get_object_or_404(Todo, pk=pk)

    if request.method == 'POST':
        todo.title = request.POST.get('title', todo.title)
        todo.description = request.POST.get('description', todo.description)
        due_date = request.POST.get('due_date') or None
        todo.due_date = due_date
        todo.save()
        return redirect('todo_list')

    return render(request, 'edit_todo.html', {'todo': todo})


def todo_delete(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == 'POST':
        todo.delete()
        return redirect('todo_list')
    return render(request, 'delete_confirm.html', {'todo': todo})


def todo_toggle_complete(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.is_completed = not todo.is_completed
    todo.save()
    return redirect('todo_list')
