import client from '@lib/api';
import useFiltersFromUrl from '@lib/useFiltersFromUrl';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import getDateFilter from '@lib/getDateFilter';
import CategoryReport from './CategoryReport';
import NoTransactionsFound from './NoTransactionsFound';

const CategorizedExpensesReport = () => {
  const { filtersByField } = useFiltersFromUrl();
  const { data, isLoading } = client.getCategoryReport.useQuery({
    type: 'Expense',
    date: getDateFilter(filtersByField),
    accounts: filtersByField.accounts?.split(','),
    currency: filtersByField.currency,
    categories: filtersByField.categories?.split(','),
  });

  if (isLoading) {
    return <FullScreenSpinner />;
  } else if (!data || data.categories.length === 0) {
    return <NoTransactionsFound />;
  }

  return (
    <CategoryReport
      data={data}
      numberType="negative"
      currency={filtersByField.currency}
    />
  );
};

export default CategorizedExpensesReport;
