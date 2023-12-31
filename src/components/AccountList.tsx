import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import useDialogForId from '@lib/useDialogForId';
import type { Account } from '@server/account/types';
import useDeleteAccount from '@lib/accounts/useDeleteAccount';
import useUpdateAccount from '@lib/accounts/useUpdateAccount';
import type { CSVImportPreset } from '@server/csvImportPreset/types';
import ConfirmationDialog from './ConfirmationDialog';
import AccountListItem from './AccountListItem';
import CreateUpdateAccountDialog from './CreateUpdateAccountDialog';

type Props = {
  accounts: Account[];
  presets: CSVImportPreset[];
};

const AccountList = ({ accounts, presets }: Props) => {
  const {
    openFor,
    open: deleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDialogForId('deleteAccount');
  const { mutateAsync: deleteAccount, isLoading: isDeleting } =
    useDeleteAccount();
  const handleDelete = () =>
    openFor ? deleteAccount({ id: openFor }) : undefined;

  const {
    openFor: accountId,
    open: isUpdateDialogOpen,
    onOpen: onUpdateDialogOpen,
    onClose: onUpdateDialogClose,
  } = useDialogForId('updateAccount');
  const account = useMemo(
    () => accounts.find((account) => account.id === accountId),
    [accounts, accountId],
  );
  const { mutateAsync: updateAccount, isLoading: isUpdating } =
    useUpdateAccount();

  return (
    <Paper>
      <List>
        {accounts.map((account) => (
          <AccountListItem
            key={account.id}
            account={account}
            onUpdate={onUpdateDialogOpen}
            onDelete={onDeleteOpen}
          />
        ))}

        <ConfirmationDialog
          id="delete-account"
          title="Delete account"
          open={deleteOpen}
          loading={isDeleting}
          onClose={onDeleteClose}
          onConfirm={handleDelete}
        >
          <Typography variant="body1">
            Are you sure you want to delete this account? The action cannot be
            undone and all transactions for the account will also be deleted.
          </Typography>
        </ConfirmationDialog>

        {!!account && (
          <CreateUpdateAccountDialog
            account={account}
            presets={presets}
            open={isUpdateDialogOpen}
            loading={isUpdating}
            onClose={onUpdateDialogClose}
            onUpdate={updateAccount}
          />
        )}
      </List>
    </Paper>
  );
};

export default AccountList;
