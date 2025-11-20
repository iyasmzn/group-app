import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { coopRepaymentService } from "@/services/groupCoopService"
import { Database } from "@/types/database.types"

// Ambil type row dari Supabase types
type RepaymentRow = Database["public"]["Tables"]["group_coop_repayments"]["Row"]


// ✅ Query repayments per loan
export function useCoopRepayments(loanId: string) {
  return useQuery<RepaymentRow[]>({
    queryKey: ["coopRepayments", loanId],
    queryFn: async () => {
      const { data, error } = await coopRepaymentService.getRepayments(loanId)
      if (error) throw error
      return data ?? []
    },
    enabled: !!loanId,
  })
}

// ✅ Mutation add repayment dengan optimistic update
export function useAddRepayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: coopRepaymentService.addRepayment,

    onMutate: async (newRepayment: Omit<RepaymentRow, "id" | "created_at">) => {
      await queryClient.cancelQueries({ queryKey: ["coopRepayments", newRepayment.loan_id] })

      const previousRepayments = queryClient.getQueryData<RepaymentRow[]>([
        "coopRepayments",
        newRepayment.loan_id,
      ])

      // inject repayment sementara ke cache
      queryClient.setQueryData<RepaymentRow[]>(["coopRepayments", newRepayment.loan_id], (old = []) => [
        {
          ...newRepayment,
          id: "temp-id", // temporary ID
          created_at: new Date().toISOString(),
        } as RepaymentRow,
        ...old,
      ])

      return { previousRepayments }
    },

    onError: (_err, newRepayment, context) => {
      if (context?.previousRepayments) {
        queryClient.setQueryData(["coopRepayments", newRepayment.loan_id], context.previousRepayments)
      }
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["coopRepayments", res.repayment?.loan_id] })
      if (res.group_id) {
        queryClient.invalidateQueries({ queryKey: ["coopLedger", res.group_id] })
      }
      queryClient.invalidateQueries({ queryKey: ["coopBalance", res.repayment?.loan_id] })
    },

    onSettled: (res) => {
      if (res?.repayment?.loan_id) {
        queryClient.invalidateQueries({ queryKey: ["coopRepayments", res.repayment.loan_id] })
      }
    },
  })
}