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