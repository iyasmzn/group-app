import { coopBalanceService } from "@/services/groupCoopService";
import { useQuery } from "@tanstack/react-query";

export function useCoopLoanBalance(loanId: string) {
  return useQuery({
    queryKey: ["coopBalance", loanId],
    queryFn: () => coopBalanceService.getLoanBalance(loanId),
    enabled: !!loanId,
  });
}