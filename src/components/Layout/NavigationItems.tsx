import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InsightsIcon from '@mui/icons-material/Insights';
import SavingsIcon from '@mui/icons-material/Savings';
import LabelIcon from '@mui/icons-material/Label';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Link from 'next/link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import Routes from '@lib/routes';

const items = [
  {
    label: 'Accounts',
    href: Routes.accounts,
    icon: AccountBalanceIcon,
  },
  {
    label: 'Transactions',
    href: Routes.recentTransactions,
    icon: ReceiptLongIcon,
  },
  {
    label: 'Categories',
    href: Routes.categories,
    icon: LabelIcon,
  },
  {
    label: 'Import Presets',
    href: Routes.importPresets,
    icon: FileUploadIcon,
  },
  {
    label: 'Insights',
    href: Routes.insights,
    icon: InsightsIcon,
  },
  {
    label: 'Budget',
    href: Routes.budget,
    icon: SavingsIcon,
  },
];

const NavigationItems = () => {
  const { pathname } = useRouter();
  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItem key={item.href} disablePadding>
          <ListItemButton
            component={Link}
            href={item.href}
            selected={pathname.startsWith(item.href)}
          >
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default NavigationItems;
