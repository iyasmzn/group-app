import { coopLedgerService } from "@/services/groupCoopService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCoopLedger(groupId: string) {
  return useQuery({
    queryKey: ["coopLedger", groupId],
    queryFn: () => coopLedgerService.getLedgerByGroup(groupId),
    enabled: !!groupId,
  });
}

export function useLedgerSummary(groupId: string) {
  return useQuery({
    queryKey: ["coopLedgerSummary", groupId],
    queryFn: () => coopLedgerService.getSummary(groupId),
    enabled: !!groupId,
  });
}

export function useAddLedgerEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coopLedgerService.addEntry,
    onSuccess: (_, entry) => {
      queryClient.invalidateQueries({ queryKey: ["coopLedger", entry.group_id] });
      queryClient.invalidateQueries({ queryKey: ["coopLedgerSummary", entry.group_id] });
    },
  });
}