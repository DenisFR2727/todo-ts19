import React, { Suspense, use, useActionState, useState } from 'react';
import { fetchUsers, User } from '../../shared/api';
import { ErrorBoundary } from 'react-error-boundary';
import { PacmanLoader } from 'react-spinners';
import { createUserAction, deleteUserAction } from './actions';

const defaultUsersPromise = fetchUsers();

export function UsersPage() {
    const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
    const refetchUsers = () => {
        // Для сетинга нового запиту!
        setUsersPromise(fetchUsers());
    };

    return (
        <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
            <h1 className="text-3xl font-bold underline flex justify-center">
                Hello Users
            </h1>
            <CreateUserForm refetchUsers={refetchUsers} />
            <ErrorBoundary
                fallbackRender={({ error }) => (
                    <div className="text-red-600">
                        {`Something went wrong: ${error.message}`}
                    </div>
                )}
            >
                <Suspense fallback={<PacmanLoader />}>
                    <UsersList
                        usersPromise={usersPromise}
                        refetchUsers={refetchUsers}
                    />
                </Suspense>
            </ErrorBoundary>
        </main>
    );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
    const [state, dispatch, isPending] = useActionState(
        createUserAction({
            refetchUsers,
        }),
        { email: '' }
    );

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
    usersPromise,
    refetchUsers,
}: {
    usersPromise: Promise<User[]>;
    refetchUsers: () => void;
}) {
    // use перетворює з юзерПромис до звичайних юзерів User[], use хук повинен працювати з саспенсом разом!
    const users = use(usersPromise);

    return (
        <div className="flex flex-col">
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    refetchUsers={refetchUsers}
                />
            ))}
        </div>
    );
}
export function UserCard({
    user,
    refetchUsers,
}: {
    user: User;
    refetchUsers: () => void;
}) {
    const [state, handleDelete, isPending] = useActionState(
        deleteUserAction({ id: user.id, refetchUsers }),
        {}
    );

    return (
        <div className="border p-2 m-2 rounded bg-gray-100 flex justify-between">
            {user.email}
            <form className="ml-auto" action={handleDelete}>
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
