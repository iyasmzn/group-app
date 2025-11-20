import { coopLedgerService } from "@/services/groupCoopService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CoopLedgerEntry } from "@/types/coop";

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

    // 🚀 Optimistic update
    onMutate: async (newEntry: CoopLedgerEntry) => {
      await queryClient.cancelQueries({ queryKey: ["coopLedger", newEntry.group_id] });

      const previousLedger = queryClient.getQueryData<any[]>(["coopLedger", newEntry.group_id]);

      // Tambahkan entry baru ke cache seolah-olah sudah berhasil
      queryClient.setQueryData<any[]>(["coopLedger", newEntry.group_id], (old = []) => [
        { ...newEntry, id: "temp-id", created_at: new Date().toISOString() },
        ...old,
      ]);

      return { previousLedger };
    },

    // ❌ Rollback kalau gagal
    onError: (_err, newEntry, context) => {
      if (context?.previousLedger) {
        queryClient.setQueryData(["coopLedger", newEntry.group_id], context.previousLedger);
      }
    },

    // ✅ Invalidate biar sync dengan server
    onSuccess: (_, newEntry) => {
      queryClient.invalidateQueries({ queryKey: ["coopLedger", newEntry.group_id] });
      queryClient.invalidateQueries({ queryKey: ["coopLedgerSummary", newEntry.group_id] });
    },
  });
}