import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import client from '@lib/api';

type Options = Parameters<typeof client.deleteCSVImportPreset.useMutation>[0];

const useDeleteCSVImportPreset = (options?: Options) => {
  const queryClient = useQueryClient();
  return client.deleteCSVImportPreset.useMutation({
    ...options,
    onSettled: (...args) =>
      Promise.all([
        options?.onSettled?.apply(this, args),
        queryClient.invalidateQueries(getQueryKey(client.getCSVImportPresets)),
      ]),
  });
};

export default useDeleteCSVImportPreset;