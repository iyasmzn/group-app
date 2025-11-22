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

      const previous = queryClient.getQueryData(["coopLoans", newLoan.group_id]);

      queryClient.setQueryData(["coopLoans", newLoan.group_id], (old: any) => {
        const temp = {
          ...newLoan,
          id: "temp-id",
          status: "pending",
          created_at: new Date().toISOString(),
        };

        if (old && Array.isArray(old.data)) {
          return { ...old, data: [temp, ...old.data] };
        }

        // kalau cache belum ada
        return { data: [temp] };
      });

      return { previous };
    },

    onError: (_err, newLoan, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["coopLoans", newLoan.group_id], context.previous);
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

export function useDeleteLoan(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanId: string) => coopLoanService.deleteLoan(loanId, groupId),

    onMutate: async (loanId: string) => {
      await queryClient.cancelQueries({ queryKey: ["coopLoans", groupId] })

      const previousLoans = queryClient.getQueryData(["coopLoans", groupId])

      queryClient.setQueryData(["coopLoans", groupId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data?.filter((loan: any) => loan.id !== loanId) ?? [],
        }
      })

      return { previousLoans }
    },


    onError: (_err, _loanId, context) => {
      // rollback kalau error
      if (context?.previousLoans) {
        queryClient.setQueryData(["coopLoans", groupId], context.previousLoans);
      }
    },

    onSuccess: () => {
      // invalidate supaya data fresh dari server
      queryClient.invalidateQueries({ queryKey: ["coopLoans", groupId] });
      queryClient.invalidateQueries({ queryKey: ["coopLedger", groupId] });
    },
  });
}