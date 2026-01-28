/* eslint-disable */
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { getTodo } from '../../service/todo';
import { useDispatch } from 'react-redux';
import { actions as currentActions } from '../../features/currentTodo';
import { RootState } from '../../app/store';
import { Status } from '../../types/Status';

const filteredTodos = (state: RootState) => {
  const { query, status } = state.filter;
  let todos = state.todos;

  if (query) {
    todos = todos.filter(todo =>
      todo.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
  }

  switch (status) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);

    case Status.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const state = useAppSelector(state => state);
  const currentTodo = useAppSelector(state => state.current);

  const todos = filteredTodos(state);

  const current = (todoId: number) => {
    getTodo(todoId).then(data => {
      dispatch(currentActions.setTodo(data));
    });
  };

  return (
    <>
      {todos.length === 0 && (
        <p className="notification is-warning">
          There are no todos matching current filter criteria
        </p>
      )}

      {todos.length > 0 && (
        <table className="table is-narrow is-fullwidth">
          <thead>
            <tr>
              <th>#</th>

              <th>
                <span className="icon">
                  <i className="fas fa-check" />
                </span>
              </th>

              <th>Title</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {todos.map(todo => (
              <tr
                data-cy="todo"
                key={todo.id}
                className={
                  currentTodo?.id === todo.id ? 'has-background-info-light' : ''
                }
              >
                <td className="is-vcentered">{todo.id}</td>
                <td className="is-vcentered">
                  {todo.completed && (
                    <span className="icon" data-cy="iconCompleted">
                      <i className="fas fa-check" />
                    </span>
                  )}
                </td>

                <td className="is-vcentered is-expanded">
                  {todo.completed ? (
                    <p className="has-text-success">{todo.title}</p>
                  ) : (
                    <p className="has-text-danger">{todo.title}</p>
                  )}
                </td>

                <td className="has-text-right is-vcentered">
                  <button
                    data-cy="selectButton"
                    className="button"
                    type="button"
                    onClick={() => current(todo.id)}
                  >
                    <span className="icon">
                      {currentTodo?.id === todo.id ? (
                        <i className="far fa-eye-slash" />
                      ) : (
                        <i className="far fa-eye" />
                      )}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
