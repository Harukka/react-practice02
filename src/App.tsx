import { useState } from 'react';

import GlobalStyles  from '@mui/material/GlobalStyles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo, pink } from '@mui/material/colors';

import { FormDialog }  from './FormDialog';
import { ActionButton } from './ActionButton';
import { SideBar } from './SideBar';
import { TodoItem } from './TodoItem';
import { ToolBar } from './ToolBar';
import { QR } from './QR';


const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: pink[500],
      light: '#ff6090',
      dark: '#b0003a',
    },
  },
});
export const App = () => {

  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  
  const [drawerOpen, setDrawerOpen ] = useState(false);

  const [qrOpen, setQrOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleToggleQR = () => {
    setQrOpen((qrOpen) => !qrOpen);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen((drawerOpen) => !drawerOpen);
  };
    
  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
  };

  const handleToggleDialog = () => {
    setDialogOpen((dialogOpen) => !dialogOpen);
    setText('');
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
    if (!text) {
      //何も入力されなかった時
      setDialogOpen((dialogOpen) => !dialogOpen)
      return;
    }
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
    setDialogOpen((dialogOpen) => !todos);
  };

  const handleSort = (filter: Filter) => {
    setFilter(filter);
  };
  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ body: { margin: 0, padding: 0} }} />
      <ToolBar filter={filter} onToggleDrawer={handleToggleDrawer} />
      <SideBar 
        drawerOpen={drawerOpen}
        onToggleDrawer={handleToggleDrawer}
        onSort={handleSort}
        onToggleQR={handleToggleQR}
      />
      <QR open={qrOpen} onClose={handleToggleQR} />      
      <FormDialog
            text={text}
            dialogOpen={dialogOpen}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onToggleDialog={handleToggleDialog}
      />
      <TodoItem todos={todos} filter={filter} onTodo={handleTodo} />
      <ActionButton todos={todos} onEmpty={handleEmpty} />
    </ThemeProvider>
  );
};