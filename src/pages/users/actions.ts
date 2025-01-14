import { createUser, deleteUser, User } from '../../shared/api';
// Types
export type CreateActionState = {
    error?: string;
    email: string;
};

export type CreateUserAction = (
    state: CreateActionState,
    formData: FormData
) => Promise<CreateActionState>;

// export type CreateUserAction = (state: CreateActionState, formData:FormData): Promise<CreateActionState>

//--------------------------------------Actions
export function createUserAction({
    refetchUsers,
    optimisticCreate,
}: {
    refetchUsers: () => void;
    optimisticCreate: (user: User) => void;
}): CreateUserAction {
    return async (_, formData: FormData) => {
        const email = formData.get('email') as string;

        if (email === 'dh92fr@gmail.com') {
            return {
                error: 'Admin account is not allowed',
                email,
            };
        }

        try {
            const user = {
                email,
                id: crypto.randomUUID(),
            };

            optimisticCreate(user);
            await createUser(user);

            refetchUsers();

            return {
                email: '',
            };
        } catch {
            return {
                email,
                error: 'Error while creating user',
            };
        }
    };
}
// Delete Action
export type DeleteUserActionState = {
    error?: string;
};

export type DeleteUserAction = (
    state: DeleteUserActionState,
    formData: FormData
) => Promise<DeleteUserActionState>;

export const deleteUserAction = ({
    refetchUsers,
    optimisticDelete,
}: {
    refetchUsers: () => void;
    optimisticDelete: (id: string) => void;
}): DeleteUserAction => {
    return async (_, formData: FormData) => {
        const id = formData.get('id') as string;
        try {
            optimisticDelete(id);
            await deleteUser(id);
            refetchUsers();
            return {};
        } catch {
            return {
                error: 'Error while deleting user',
            };
        }
    };
};
