import { Route, Routes } from 'react-router-dom';
import { UsersPage } from '../pages/users';
import { TodoListPage } from '../pages/todo-list';
import { ThemeProvider } from '../pages/users/context';

export function App() {
    return (
        <ThemeProvider>
            <Routes>
                <Route path="/" element={<UsersPage />}></Route>
                <Route path="/usersId/tasks" element={<TodoListPage />}></Route>
            </Routes>
        </ThemeProvider>
    );
}
