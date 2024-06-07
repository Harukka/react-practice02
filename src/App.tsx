import { useState } from 'react';

type Todo = {
  value: string;
  readonly id: number;
  checked: boolean;
};

export const App = () => {

  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

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

  return (
    <div>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        >
        <input
          type="text"
          // text ステートが持っている入力中のテキストの値をvalueとして表示
          value={text}
          // onChange イベント(=入力テキストの変化)をtextステートに反映する
          onChange={(e) => handleChange(e)}
        />
        <input type="submit" value="追加" onSubmit={handleSubmit} />
      </form>
      <ul>
        {todos.map((todo) => {
          return (
          <li key={todo.id}>
            <input
              type='checkbox'
              checked={todo.checked}
              // 呼び出し側で checked フラグを反転させる
              onChange={() => handleCheck(todo.id, !todo.checked)}
            />
            <input 
              type='text'
              disabled={todo.checked}
              value={todo.value}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
          </li>
        );
        })}
      </ul>
    </div>
  );
};