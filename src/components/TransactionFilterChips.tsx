import stringToColor from 'string-to-color';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import PaymentIcon from '@mui/icons-material/Payment';
import PaidIcon from '@mui/icons-material/Paid';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useFiltersFromUrl from '@lib/useFiltersFromUrl';
import {
  type TransactionType,
  TransactionTypes,
} from '@server/transaction/types';
import client from '@lib/api';
import type { Account } from '@server/account/types';
import type { Category } from '@server/category/types';
import { formatDate } from '@lib/format';

const TransactionFilterChips = () => {
  const theme = useTheme();
  const { filtersByField, setFilters } = useFiltersFromUrl();
  const { data: accounts } = client.getAccounts.useQuery();
  const { data: categories } = client.getCategories.useQuery();

  const accountsById = useMemo(
    () =>
      (accounts?.accounts || []).reduce<Record<string, Account>>(
        (acc, account) => ({ ...acc, [account.id]: account }),
        {},
      ),
    [accounts],
  );
  const categoriesById = useMemo(
    () =>
      (categories || []).reduce<Record<string, Category>>(
        (acc, category) => ({ ...acc, [category.id]: category }),
        {},
      ),
    [categories],
  );

  const handleClearType = () => setFilters({ type: undefined });
  const handleClearAccount = () => setFilters({ accountId: undefined });
  const handleClearCategory = () => setFilters({ categoryId: undefined });
  const handleClearDescription = () => setFilters({ description: undefined });
  const handleClearAmount = () =>
    setFilters({ minAmount: undefined, maxAmount: undefined });
  const handleClearDate = () =>
    setFilters({ from: undefined, until: undefined });

  if (Object.keys(filtersByField).length === 0) {
    return null;
  }

  const hasAmount = !!filtersByField.minAmount || !!filtersByField.maxAmount;
  const onlyMax = !filtersByField.minAmount && !!filtersByField.maxAmount;
  const onlyMin = !!filtersByField.minAmount && !filtersByField.maxAmount;

  const hasDate = !!filtersByField.from || !!filtersByField.until;
  const onlyFrom = !!filtersByField.from && !filtersByField.until;
  const onlyUntil = !filtersByField.from && !!filtersByField.until;

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
      {hasDate && (
        <Chip
          variant="outlined"
          label={
            onlyFrom
              ? `From ${formatDate(new Date(filtersByField.from as string))}`
              : onlyUntil
              ? `Until ${formatDate(new Date(filtersByField.until as string))}`
              : `Between ${formatDate(
                  new Date(filtersByField.from as string),
                )} and ${formatDate(new Date(filtersByField.until as string))}`
          }
          onDelete={handleClearDate}
        />
      )}
      {hasAmount && (
        <Chip
          variant="outlined"
          label={
            onlyMax
              ? `(-∞, ${filtersByField.maxAmount}]`
              : onlyMin
              ? `[${filtersByField.minAmount}, ∞)`
              : `[${filtersByField.minAmount}, ${filtersByField.maxAmount}]`
          }
          onDelete={handleClearAmount}
        />
      )}
      {!!filtersByField.accountId && accountsById[filtersByField.accountId] && (
        <Chip
          variant="outlined"
          label={accountsById[filtersByField.accountId].name}
          onDelete={handleClearAccount}
        />
      )}
      {!!filtersByField.type &&
        TransactionTypes.includes(filtersByField.type as TransactionType) && (
          <Chip
            variant="outlined"
            label={filtersByField.type}
            icon={
              filtersByField.type === 'Expense' ? (
                <PaymentIcon />
              ) : filtersByField.type === 'Income' ? (
                <PaidIcon />
              ) : (
                <SwapHorizIcon />
              )
            }
            onDelete={handleClearType}
          />
        )}
      {!!filtersByField.categoryId &&
        categoriesById[filtersByField.categoryId] && (
          <Chip
            sx={{
              backgroundColor: stringToColor(
                categoriesById[filtersByField.categoryId].name,
              ),
              color: theme.palette.getContrastText(
                stringToColor(categoriesById[filtersByField.categoryId].name),
              ),
            }}
            variant="outlined"
            label={categoriesById[filtersByField.categoryId].name}
            onDelete={handleClearCategory}
          />
        )}
      {!!filtersByField.description && (
        <Chip
          variant="outlined"
          label={`Description: *${filtersByField.description}*`}
          onDelete={handleClearDescription}
        />
      )}
    </Stack>
  );
};

export default TransactionFilterChips;
