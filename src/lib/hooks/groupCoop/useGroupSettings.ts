import { coopSettingsService } from "@/services/groupCoopService";
import { CoopSettings } from "@/types/coop";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useGroupSettings(groupId: string) {
  return useQuery<CoopSettings | undefined>({
    queryKey: ["coopSettings", groupId],
    queryFn: async () => {
      const { data, error } = await coopSettingsService.getSettings(groupId)
      if (error) throw error
      return data as CoopSettings | undefined
    },
    enabled: !!groupId,
  })
}


export function useUpdateSettings(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: any) => coopSettingsService.updateSettings(groupId, settings),

    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ["coopSettings", groupId] });

      const previousSettings = queryClient.getQueryData<any>(["coopSettings", groupId]);

      queryClient.setQueryData(["coopSettings", groupId], {
        ...previousSettings,
        ...newSettings,
      });

      return { previousSettings };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(["coopSettings", groupId], context.previousSettings);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coopSettings", groupId] });
    },
  });
}

export function useCoopSettings(groupId: string) {
  const query = useGroupSettings(groupId)
  const mutation = useUpdateSettings(groupId)

  return {
    settings: query.data,
    loading: query.isLoading,
    error: query.error,
    saveSettings: mutation.mutateAsync,
    saving: mutation.isPending,
  }
}