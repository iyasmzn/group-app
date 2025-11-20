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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coopSettings", groupId] });
    },
  });
}