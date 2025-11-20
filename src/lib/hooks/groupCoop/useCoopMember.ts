import { coopMemberService } from "@/services/groupCoopService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCoopMembers(groupId: string) {
  return useQuery({
    queryKey: ["coopMembers", groupId],
    queryFn: () => coopMemberService.getCoopMembers(groupId),
    enabled: !!groupId,
  });
}

export function useAddCoopMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      coopMemberService.addCoopMember(groupId, userId),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["coopMembers", vars.groupId] });
    },
  });
}