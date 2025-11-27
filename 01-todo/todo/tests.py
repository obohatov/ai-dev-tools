from django.test import TestCase
from django.urls import reverse
from .models import Todo


class TodoViewsTest(TestCase):
    def test_create_todo(self):
        response = self.client.post(reverse('todo_list'), {
            'title': 'Test TODO',
            'description': 'Test description',
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Todo.objects.count(), 1)

    def test_toggle_completion(self):
        todo = Todo.objects.create(title='Test', is_completed=False)
        response = self.client.get(reverse('todo_toggle', args=[todo.pk]))
        self.assertEqual(response.status_code, 302)
        todo.refresh_from_db()
        self.assertTrue(todo.is_completed)

