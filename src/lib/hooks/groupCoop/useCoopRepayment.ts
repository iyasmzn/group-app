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
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["coopRepayments", res.repayment?.loan_id] });
      queryClient.invalidateQueries({ queryKey: ["coopLedger", res.group_id] });
      queryClient.invalidateQueries({ queryKey: ["coopBalance", res.repayment?.loan_id] });
    },
  });
}