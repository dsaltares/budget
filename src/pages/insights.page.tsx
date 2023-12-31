import type { NextPage } from 'next';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TuneIcon from '@mui/icons-material/Tune';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Head from 'next/head';
import WithAuthentication from '@components/WithAuthentication';
import useFiltersFromUrl from '@lib/useFiltersFromUrl';
import CategorizedExpensesReport from '@components/Reports/CategorizedExpensesReport';
import CategorizedIncomeReport from '@components/Reports/CategorizedIncomeReport';
import useDialog from '@lib/useDialog';
import ReportSettingsDialog from '@components/ReportSettingsDialog';
import client from '@lib/api';
import IncomeVsExpensesReport from '@components/Reports/IncomeVsExpensesReport';
import AccountBalancesReport from '@components/Reports/AccountBalancesReport';
import BalanceForecastReport from '@components/Reports/BalanceForecastReport';
import AppName from '@lib/appName';
import ReportSettingsChips from '@components/ReportSettingsChips';
import CategorizedExpensesOverTimeReport from '@components/Reports/CategorizedExpensesOverTimeReport';

const Reports = {
  categorizedExpenses: {
    name: 'Where the money goes',
    Component: CategorizedExpensesReport,
  },
  categorizedIncome: {
    name: 'Where the money comes from',
    Component: CategorizedIncomeReport,
  },
  categorizedExpensesOverTime: {
    name: 'Where the money goes over time',
    Component: CategorizedExpensesOverTimeReport,
  },
  incomeVsExpenses: {
    name: 'Income vs Expenses',
    Component: IncomeVsExpensesReport,
  },
  accountBalances: {
    name: 'Account balances',
    Component: AccountBalancesReport,
  },
  balanceForecast: {
    name: 'Balance forecast',
    Component: BalanceForecastReport,
  },
};

type Report = keyof typeof Reports;

const InsightsPage: NextPage = () => {
  const {
    open: isSettingsDialogOpen,
    onOpen: onSettingsDialogOpen,
    onClose: onSettingsDialogClose,
  } = useDialog('reportSettings');
  const { filtersByField, setFilters } = useFiltersFromUrl();
  const { data: accounts } = client.getAccounts.useQuery();
  const { data: categories } = client.getCategories.useQuery();
  const numFilters = Object.keys(filtersByField).filter(
    (field) => field !== 'report',
  ).length;
  const report: Report =
    filtersByField.report && Reports.hasOwnProperty(filtersByField.report)
      ? (filtersByField.report as Report)
      : 'categorizedExpenses';
  const ReportComponent = Reports[report].Component;
  return (
    <>
      <Head>
        <title>{`Insights - ${AppName}`}</title>
      </Head>
      <Stack gap={2} height="100%">
        <Stack direction="row" gap={1} alignItems="center">
          <FormControl fullWidth>
            <InputLabel id="select-report-label">Report</InputLabel>
            <Select
              label="Report"
              id="select-report"
              labelId="select-report-label"
              value={report}
              onChange={(e) => setFilters({ report: e.target.value })}
            >
              {Object.entries(Reports).map(([value, { name }]) => (
                <MenuItem key={value} value={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack>
            <Badge badgeContent={numFilters} color="secondary">
              <IconButton color="primary" onClick={onSettingsDialogOpen}>
                <TuneIcon />
              </IconButton>
            </Badge>
          </Stack>
        </Stack>
        <ReportSettingsChips />
        <ReportComponent />
        {isSettingsDialogOpen && (
          <ReportSettingsDialog
            open={isSettingsDialogOpen}
            onClose={onSettingsDialogClose}
            accounts={accounts?.accounts || []}
            categories={categories || []}
          />
        )}
      </Stack>
    </>
  );
};

export default WithAuthentication(InsightsPage);
