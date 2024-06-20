import { useState } from 'react';
import { FormDialog }  from './FormDialog';
import { ActionButton } from './ActionButton';
import { SideBar } from './SideBar';
import { TodoItem } from './TodoItem';
// type Todo = {
//   value: string;
//   readonly id: number;
//   checked: boolean;
//   removed: boolean;
// };

// type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

export const App = () => {

  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const handleChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, [key]: value };
        } else {
          return todo;
        }
      });
      return newTodos;
    });
  }
  const handleSubmit = () => {
    if (!text) return;

    // 新しいTodoを作成
    // 明示的に型注釈をつけてオブジェクトの型を限定する
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };
    /**
     * 更新前の todos ステートを元に
     * スプレッド構文で展開した要素へ
     * newTodo を加えた新しい配列でステートを更新
     **/
    setTodos((todos) => [newTodo, ...todos]);
    // フォームへの入力をクリアする
    setText('');

  };

  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      /**
       * 引数として渡された todo の id が一致する
       * 更新前の todos ステート内の todo の
       * value プロパティを引数 value (= e.target.value) に書き換える
       */
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          /**
           * この階層でオブジェクト todo をコピー・展開し、
           * その中で value プロパティを引数で上書きする
           */
          return { ...todo, value: value };
          
        }
        return todo;
      });

      // todos ステートを更新
      return newTodos;
    });
    // // todos ステート配列をチェック DELETE LATER
    // console.log('===Original todos===');
    // todos.map((todo) => {
    //   console.log(`id:  ${todo.id}, value: ${todo.value}`);
    // });
  };

  const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id){
          return{ ...todo, checked};
        }
        return todo;
      });
      return newTodos;
    });
  };

  const handleRemove = (id: number, removed: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, removed};
        }
        return todo;
      });
      return newTodos;
    });
  }
  const handleSort = (filter: Filter) => {
    setFilter(filter);
  };
  const filteredTodo = todos.filter((todo) => {
    switch(filter){
      case 'all':
        return !todo.removed;
      case 'checked':
        return todo.checked && !todo.removed;
      case 'unchecked':
        return !todo.checked && !todo.removed;
      case 'removed':
        return todo.removed;
      default:
        return todo;
    }
  });
  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  return (
    <div>
      <SideBar onSort={handleSort} />      
      <FormDialog
            text={text}
            onChange={handleChange}
            onSubmit={handleSubmit}
      />
      <TodoItem todos={todos} filter={filter} onTodo={handleTodo} />
      <ActionButton todos={todos} onEmpty={handleEmpty} />
    </div>
  );
};