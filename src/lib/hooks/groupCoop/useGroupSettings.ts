import { coopSettingsService } from "@/services/groupCoopService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useGroupSettings(groupId: string) {
  return useQuery({
    queryKey: ["coopSettings", groupId],
    queryFn: () => coopSettingsService.getSettings(groupId),
    enabled: !!groupId,
  });
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