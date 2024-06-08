import { useState } from 'react';

type Todo = {
  value: string;
  readonly id: number;
  checked: boolean;
  removed: boolean;
};

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

export const App = () => {

  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const handleChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

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

  return (
    <div>
      <select defaultValue="all" onChange={(e) => handleSort(e.target.value as Filter)}>
        <option value="all">全てのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ゴミ箱</option>
      </select>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        >
        <input
          type="text"
          value={text}
          disabled={filter === 'checked' || filter === 'removed'}
          onChange={(e) => handleChange(e)}
        />
        <input 
          type="submit"
          value="追加"
          disabled={filter === 'checked' || filter === 'removed'}
          onSubmit={handleSubmit}
        />
      </form>
      <ul>
        {filteredTodo.map((todo) => {
          return (
          <li key={todo.id}>
            <input
              type='checkbox'
              disabled={todo.removed}
              checked={todo.checked}
              // 呼び出し側で checked フラグを反転させる
              onChange={() => handleCheck(todo.id, !todo.checked)}
            />
            <input 
              type='text'
              disabled={todo.checked || todo.removed}
              value={todo.value}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
            <button onClick={() => handleRemove(todo.id, !todo.removed)}>
              {todo.removed ? '復元' : '削除'}
            </button>
          </li>
        );
        })}
      </ul>
    </div>
  );
};