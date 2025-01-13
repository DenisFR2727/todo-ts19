import { createUser, deleteUser } from '../../shared/api';
// Types
export type CreateActionState = {
    error?: string;
    email: string;
};

export type CreateUserAction = (
    state: CreateActionState,
    formData: FormData
) => Promise<CreateActionState>;
//--------------------------------------Actions
export function createUserAction({
    refetchUsers,
}: // optimisticCreate,
{
    refetchUsers: () => void;
    // optimisticCreate: (user: User) => void;
}): CreateUserAction {
    return async (_, formData) => {
        const email = formData.get('email') as string;
        if (email.length === 0) {
            return {
                error: 'Email cannot be empty',
                email: '',
            };
        }
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

            // optimisticCreate(user);
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

export type DeleteUserActionState = {
    error?: string;
};

export type DeleteUserAction = (
    state: DeleteUserActionState,
    formData: FormData
) => Promise<DeleteUserActionState>;

export const deleteUserAction =
    ({ id, refetchUsers }: { refetchUsers: () => void; id: string }) =>
    async (): Promise<DeleteUserActionState> => {
        try {
            await deleteUser(id);
            refetchUsers();
            return {};
        } catch {
            return {
                error: ' Error while deleting user',
            };
        }
    };
