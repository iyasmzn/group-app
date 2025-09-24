"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, UserMinus, UserPlus2 } from "lucide-react";
import Reveal from "@/components/animations/Reveal";
import LoadingOverlay from "@/components/loading-overlay";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmRemoveModal from "./components/confirm-remove-modal";
import { GroupMember, GroupRole } from "@/types/group";
import BackButton from "@/components/back-button";

export default function ManageMembersPage() {
  const { supabase } = useAuth();
  const { groupId } = useParams();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [roles, setRoles] = useState<GroupRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [removeTarget, setRemoveTarget] = useState<GroupMember | null>(null);
  const [loadedPage, setLoadedPage] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: membersData, error: membersError } = await supabase
        .from("group_members")
        .select(`
          id,
          role_id,
          profiles ( id, full_name, avatar_url ),
          group_roles ( id, code, name )
        `)
        .eq("group_id", groupId);

      const { data: rolesData, error: rolesError } = await supabase
        .from("group_roles")
        .select("id, code, name")
        .eq("group_id", groupId);

      if (membersError || rolesError) {
        toast.error("Gagal mengambil data members/roles.");
        console.error(membersError || rolesError);
      } else {
        setMembers(membersData as GroupMember[]);
        setRoles(rolesData as GroupRole[]);
      }
      setLoading(false);
      setLoadedPage(true)
    };

    fetchData();
  }, [groupId, supabase]);

  const handleRoleChange = async (memberId: string, newRoleId: string) => {
    setLoading(true)
    const { error } = await supabase
      .from("group_members")
      .update({ role_id: newRoleId })
      .eq("id", memberId);

    if (error) {
      setLoading(false)
      toast.error("Gagal update role member.");
    } else {
      setLoading(false)
      toast.success("Role member berhasil diupdate.");
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? {
                ...m,
                role_id: newRoleId,
                group_roles: roles.find((r) => r.id === newRoleId)!,
              }
            : m
        )
      );
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;

    setLoading(true)
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", removeTarget.id);

    if (error) {
      setLoading(false)
      toast.error("Gagal menghapus member.");
    } else {
      setLoading(false)
      toast.success("Member berhasil dihapus.");
      setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id));
      setRemoveTarget(null);
    }
  };

  const handleInvite = async () => {
    setLoading(true)
    try {
      if (!inviteEmail) {
        toast.error("Email wajib diisi.");
        return;
      }
      const defaultRole = roles.find((r) => r.code === "member");
      if (!defaultRole) {
        toast.error("Role default member tidak ditemukan.");
        return;
      }
  
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("email", inviteEmail)
        .single();
  
      if (!profile) {
        toast.error("User dengan email ini belum terdaftar.");
        return;
      }
  
      const { data, error } = await supabase
        .from("group_members")
        .insert({
          group_id: groupId,
          user_id: profile.id,
          role_id: defaultRole.id,
        })
        .select(
          "id, role_id, profiles(id, full_name, avatar_url), group_roles(id, code, name)"
        )
        .single();
  
      if (error) {
        toast.error("Gagal mengundang member.");
      } else {
        toast.success("Member berhasil ditambahkan.");
        setMembers((prev) => [...prev, data as GroupMember]);
        setInviteEmail("");
      }
    } finally {
      setLoading(false)
    }
  };

  if (loading && !loadedPage) return <LoadingOverlay />;

  return (
    <div className="p-2 md:p-6">
      <LoadingOverlay isLoading={loading} />      
      <div className="flex items-center mb-4 gap-2">
        <BackButton />
        <UserCog />
        <h1 className="text-2xl font-bold">
          Manage Members
        </h1>
      </div>

      {/* Invite */}
      <Reveal animation="fadeInDown">
        <div className="flex gap-2 mb-6">
          <Input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Invite by email"
          />
          <Button onClick={handleInvite}>
            <UserPlus2 className="w-4 h-4 mr-1" /> Invite
          </Button>
        </div>
      </Reveal>

      {/* Members list */}
      <ul className="divide-y">
        {members.map((m, idx) => (
          <Reveal
            key={m.id}
            animation={"fadeInRight"}
            delay={idx * 0.1}
          >
            <li className="flex items-center justify-between p-4 hover:bg-accent">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {m.profiles?.avatar_url ? (
                    <AvatarImage src={m.profiles.avatar_url} />
                  ) : (
                    <AvatarFallback>
                      {m.profiles?.full_name?.[0] || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{m.profiles?.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.group_roles?.name} ({m.group_roles?.code})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={m.role_id}
                  onValueChange={(val) => handleRoleChange(m.id, val)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setRemoveTarget(m)}
                >
                  <UserMinus className="w-4 h-4" />
                </Button>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>

      {/* Confirm Remove Modal */}
      <ConfirmRemoveModal
        open={!!removeTarget}
        memberName={removeTarget?.profiles?.full_name}
        onConfirm={handleRemove}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}