import { Suspense, use, useActionState } from 'react';
import { User } from '../../shared/api';
import { ErrorBoundary } from 'react-error-boundary';
import { PacmanLoader } from 'react-spinners';
import { CreateUserAction, DeleteUserAction } from './actions';
import { ThemeContext } from './context';
import { useUsers } from './use-users';

// Types
import { ThemeContextType } from './types';

export function UsersPage() {
    const { theme, toggleTheme } = use(ThemeContext) as ThemeContextType;
    const { useUsersList, createUserAction, deleteUserAction } = useUsers(); // custom hook useUsers

    return (
        <main
            style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
            }}
            className="container mx-auto p-4 pt-10 flex flex-col gap-4"
        >
            <h1 className="text-3xl font-bold underline flex justify-center">
                Hello Users
            </h1>
            <button
                className="p-1  bg-blue-500 rounded-[10px]"
                onClick={toggleTheme}
            >
                change theme
            </button>
            <CreateUserForm createUserAction={createUserAction} />
            <ErrorBoundary
                fallbackRender={({ error }) => (
                    <div className="text-red-600">
                        {`Something went wrong: ${error.message}`}
                    </div>
                )}
            >
                <Suspense fallback={<PacmanLoader />}>
                    <UsersList
                        useUsersList={useUsersList}
                        deleteUserAction={deleteUserAction}
                    />
                </Suspense>
            </ErrorBoundary>
        </main>
    );
}

export function CreateUserForm({
    createUserAction,
}: {
    createUserAction: CreateUserAction;
}) {
    const [state, dispatch, isPending] = useActionState(createUserAction, {
        email: '',
    });

    return (
        <form className="flex gap-2" action={dispatch}>
            <input
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                defaultValue={state.email}
                disabled={isPending}
            />
            <button
                className="w-[100px]  bg-blue-500 rounded-[10px] p-2 disabled:bg-slate-500"
                type="submit"
                disabled={isPending}
            >
                Add
            </button>
            {state.error && <div className="text-red-600">{state.error}</div>}
        </form>
    );
}

export function UsersList({
    deleteUserAction,
    useUsersList,
}: {
    deleteUserAction: DeleteUserAction;
    useUsersList: () => User[];
}) {
    // useUserList перетворює з юзерПромис до звичайних юзерів User[], use хук повинен працювати з саспенсом разом!
    const users = useUsersList();

    return (
        <div className="flex flex-col">
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    deleteUserAction={deleteUserAction}
                />
            ))}
        </div>
    );
}
export function UserCard({
    user,
    deleteUserAction,
}: {
    user: User;
    deleteUserAction: DeleteUserAction;
}) {
    const bgCard = use(ThemeContext) as ThemeContextType;
    const [state, handleDelete, isPending] = useActionState(
        deleteUserAction,
        {}
    );

    return (
        <div
            style={{ background: bgCard.theme.colors.background }}
            className="border p-2 m-2 rounded bg-gray-100 flex justify-between"
        >
            {user.email}
            <form className="ml-auto" action={handleDelete}>
                <input type="hidden" name="id" value={user.id} />
                <button
                    className="p-2 bg-red-500 mr-4 disabled:bg-red-300"
                    disabled={isPending}
                >
                    Delete
                    {state.error && (
                        <div className="text-red-500">{state.error}</div>
                    )}
                </button>
            </form>
        </div>
    );
}
