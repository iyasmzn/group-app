import { coopMemberService } from "@/services/groupCoopService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCoopMembers(groupId: string) {
  return useQuery({
    queryKey: ["coopMembers", groupId],
    queryFn: async () => {
      const { data, error } = await coopMemberService.getCoopMembers(groupId)
      if (error) throw error
      return data ?? []   // ✅ selalu array
    },
    enabled: !!groupId,
  })
}

export function useAddCoopMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      coopMemberService.addCoopMember(groupId, userId),

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["coopMembers", vars.groupId] });

      const previousMembers = queryClient.getQueryData<any[]>(["coopMembers", vars.groupId]);

      queryClient.setQueryData<any[]>(["coopMembers", vars.groupId], (old = []) => [
        { id: "temp-id", user_id: vars.userId, role: "member", status: "active" },
        ...old,
      ]);

      return { previousMembers };
    },

    onError: (_err, vars, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(["coopMembers", vars.groupId], context.previousMembers);
      }
    },

    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["coopMembers", vars.groupId] });
    },
  });
}