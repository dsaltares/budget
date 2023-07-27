import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useFiltersFromUrl from '@lib/useFiltersFromUrl';
import { currencyOptionsById } from '@lib/autoCompleteOptions';
import { TimeGranularities, type TimeGranularity } from '@server/budget/types';
import TimeGranularitySelect from './TimeGranularitySelect';
import CurrencyAutocomplete from './CurrencyAutocomplete';

const DefaultCurrency = 'EUR';
const DefaultGranularity: TimeGranularity = 'Monthly';

type Props = {
  open: boolean;
  onClose: () => void;
};

const id = 'budget-options-dialog';

const BudgetOptionsDialog = ({ open, onClose }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { filtersByField, setFilters } = useFiltersFromUrl();
  const [date, setDate] = useState<Date | null>(
    typeof filtersByField.date === 'string'
      ? new Date(filtersByField.date)
      : new Date(),
  );
  const [granularity, setGranularity] = useState<TimeGranularity | ''>(
    (filtersByField.granularity || 'Monthly') as TimeGranularity,
  );
  const [currency, setCurrency] = useState(
    currencyOptionsById[filtersByField.currency ?? DefaultCurrency],
  );

  const handleApplyFilters = () => {
    setFilters({
      date: date?.toISOString(),
      currency: currency.id !== DefaultCurrency ? currency.id : undefined,
      granularity: granularity === DefaultGranularity ? undefined : granularity,
    });
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      date: undefined,
      currency: undefined,
      granularity: undefined,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      id={id}
      aria-labelledby={`${id}-title`}
      fullScreen={fullScreen}
      keepMounted={false}
    >
      <DialogTitle id={`${id}-title`}>Budget options</DialogTitle>
      <DialogContent>
        <Stack paddingY={1} gap={1.75}>
          <Stack gap={2}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(date) => {
                setDate(date);
              }}
              disableFuture
              format="dd/MM/yyyy"
            />
            <TimeGranularitySelect
              value={granularity}
              onChange={(newGranularity) =>
                setGranularity(newGranularity as TimeGranularity)
              }
              granularities={[...TimeGranularities]}
            />
            <CurrencyAutocomplete value={currency} onChange={setCurrency} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="error" onClick={handleClearFilters}>
          Clear
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={handleApplyFilters}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetOptionsDialog;
