import { coopRepaymentService } from "@/services/groupCoopService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCoopRepayments(loanId: string) {
  return useQuery({
    queryKey: ["coopRepayments", loanId],
    queryFn: () => coopRepaymentService.getRepayments(loanId),
    enabled: !!loanId,
  });
}

export function useAddRepayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coopRepaymentService.addRepayment,

    // 🚀 Optimistic update
    onMutate: async (newRepayment) => {
      // Cancel query supaya tidak overwrite
      await queryClient.cancelQueries({ queryKey: ["coopRepayments", newRepayment.loan_id] });

      // Snapshot data lama
      const previousRepayments = queryClient.getQueryData<any[]>([
        "coopRepayments",
        newRepayment.loan_id,
      ]);

      // Update cache seolah-olah repayment sudah masuk
      queryClient.setQueryData<any[]>(["coopRepayments", newRepayment.loan_id], (old = []) => [
        { ...newRepayment, id: "temp-id", paid_at: new Date().toISOString() },
        ...old,
      ]);

      // Return snapshot untuk rollback kalau gagal
      return { previousRepayments };
    },

    // ✅ Kalau sukses, invalidate biar data sync dengan server
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["coopRepayments", res.repayment?.loan_id] });
      if (res.group_id) {
        queryClient.invalidateQueries({ queryKey: ["coopLedger", res.group_id] });
      }
      queryClient.invalidateQueries({ queryKey: ["coopBalance", res.repayment?.loan_id] });
    },

    // ❌ Kalau gagal, rollback ke data lama
    onError: (_err, newRepayment, context) => {
      if (context?.previousRepayments) {
        queryClient.setQueryData(["coopRepayments", newRepayment.loan_id], context.previousRepayments);
      }
    },

    // 🎉 Cleanup setelah mutation selesai
    onSettled: (res) => {
      if (res?.repayment?.loan_id) {
        queryClient.invalidateQueries({ queryKey: ["coopRepayments", res.repayment.loan_id] });
      }
    },
  });
}
