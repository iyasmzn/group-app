import { coopDashboardService } from "@/services/groupCoopService";
import { useQuery } from "@tanstack/react-query";

export function useCoopDashboard(groupId: string) {
  return useQuery({
    queryKey: ["coopDashboard", groupId],
    queryFn: () => coopDashboardService.fetchFullCoopDashboard(groupId),
    enabled: !!groupId,
  });
}