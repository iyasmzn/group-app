import { coopLoanService } from "@/services/groupCoopService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCoopLoans(groupId: string) {
  return useQuery({
    queryKey: ["coopLoans", groupId],
    queryFn: () => coopLoanService.getLoans(groupId),
    enabled: !!groupId,
  });
}

export function useLoanDetail(loanId: string) {
  return useQuery({
    queryKey: ["coopLoanDetail", loanId],
    queryFn: () => coopLoanService.getLoanDetail(loanId),
    enabled: !!loanId,
  });
}

export function useApplyLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coopLoanService.applyLoan,

    onMutate: async (newLoan) => {
      await queryClient.cancelQueries({ queryKey: ["coopLoans", newLoan.group_id] });

      const previousLoans = queryClient.getQueryData<any[]>(["coopLoans", newLoan.group_id]);

      queryClient.setQueryData<any[]>(["coopLoans", newLoan.group_id], (old = []) => [
        { ...newLoan, id: "temp-id", status: "pending", created_at: new Date().toISOString() },
        ...old,
      ]);

      return { previousLoans };
    },

    onError: (_err, newLoan, context) => {
      if (context?.previousLoans) {
        queryClient.setQueryData(["coopLoans", newLoan.group_id], context.previousLoans);
      }
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["coopLoans", res.loan?.group_id] });
      queryClient.invalidateQueries({ queryKey: ["coopLedger", res.loan?.group_id] });
    },
  });
}

export function useUpdateLoanStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ loanId, status }: { loanId: string; status: string }) =>
      coopLoanService.updateLoanStatus(loanId, status),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["coopLoanDetail", vars.loanId] });
    },
  });
}