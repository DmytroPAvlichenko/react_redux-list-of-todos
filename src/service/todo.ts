import { Todo } from '../types/Todo';
import { getData } from '../Utils/UtilsClient';

export function getTodos(): Promise<Todo[]> {
  return getData<Todo[]>(`/todos.json`);
}

export function getTodo(todoId: number): Promise<Todo> {
  return getData<Todo[]>(`/todos.json`).then(posts => {
    return posts.find(todo => todo.id === todoId) as Todo;
  });
}
