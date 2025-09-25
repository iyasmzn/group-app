"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit3, ShieldCheck, Trash2, Plus } from "lucide-react";
import Reveal from "@/components/animations/Reveal";
import LoadingOverlay from "@/components/loading-overlay";
import RoleForm from "./components/roles-form";
import { GroupRole } from "@/types/group";
import BackButton from "@/components/back-button";

const DEFAULT_CODES = ["owner", "admin", "member"];

export default function GroupRolesPage() {
  const { supabase } = useAuth();
  const { groupId } = useParams();
  const [roles, setRoles] = useState<GroupRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from("group_roles")
        .select("*")
        .eq("group_id", groupId);

      if (error) {
        toast.error("Gagal mengambil data roles.");
        console.error(error);
      } else {
        setRoles(data);
      }
      setLoading(false);
    };

    fetchRoles();
  }, [groupId, supabase]);

  const handleSave = async (
    roleId: string,
    data: { code: string; name: string; permissions: string[] }
  ) => {
    // validasi unik code
    if (
      roles.some(
        (r) => r.code === data.code && r.id !== roleId && r.group_id === groupId
      )
    ) {
      toast.error("Code role sudah digunakan.");
      return;
    }

    const { error } = await supabase
      .from("group_roles")
      .update({
        name: data.name,
        permissions: data.permissions,
      })
      .eq("id", roleId);

    if (error) {
      toast.error("Gagal update role.");
    } else {
      toast.success("Role berhasil diupdate.");
      setRoles((prev) =>
        prev.map((r) =>
          r.id === roleId
            ? { ...r, name: data.name, permissions: data.permissions }
            : r
        )
      );
      setEditingRoleId(null);
    }
  };

  const handleDelete = async (roleId: string, code: string) => {
    if (DEFAULT_CODES.includes(code)) {
      toast.error("Role default tidak bisa dihapus.");
      return;
    }
    const { error } = await supabase.from("group_roles").delete().eq("id", roleId);
    if (error) {
      toast.error("Gagal menghapus role.");
    } else {
      toast.success("Role berhasil dihapus.");
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
    }
  };

  const handleAdd = async (data: { code: string; name: string; permissions: string[] }) => {
    // validasi unik code
    if (roles.some((r) => r.code === data.code && r.group_id === groupId)) {
      toast.error("Code role sudah digunakan.");
      return;
    }

    const { data: inserted, error } = await supabase
      .from("group_roles")
      .insert({
        group_id: groupId,
        code: data.code,
        name: data.name,
        permissions: data.permissions,
      })
      .select()
      .single();

    if (error) {
      toast.error("Gagal menambahkan role.");
    } else {
      toast.success("Role berhasil ditambahkan.");
      setRoles((prev) => [...prev, inserted]);
      setAdding(false);
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BackButton />
        <ShieldCheck className="w-6 h-6 text-primary" />
        Manage Roles
      </h1>

      <ul className="divide-y">
        {roles.map((role) => (
          <li key={role.id} className="py-4">
            {editingRoleId === role.id ? (
              <RoleForm
                initialCode={role.code}
                initialName={role.name}
                initialPermissions={role.permissions}
                isDefaultCode={DEFAULT_CODES.includes(role.code)}
                onSave={(data) => handleSave(role.id, data)}
                onCancel={() => setEditingRoleId(null)}
              />
            ) : (
              <Reveal animation="fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {role.name}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({role.code})
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {role.permissions?.join(", ") || "No permissions"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Edit3
                      className="w-4 h-4 text-secondary-foreground cursor-pointer"
                      onClick={() => setEditingRoleId(role.id)}
                    />
                    {!DEFAULT_CODES.includes(role.code) && (
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(role.id, role.code)}
                      />
                    )}
                  </div>
                </div>
              </Reveal>
            )}
          </li>
        ))}
      </ul>

      {/* Add new role */}
      <div className="mt-6">
        {adding ? (
          <RoleForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        ) : (
          <Button
            variant="primary-outline"
            className="mt-2 flex items-center gap-2"
            onClick={() => setAdding(true)}
          >
            <Plus className="w-4 h-4" /> Add Role
          </Button>
        )}
      </div>
    </div>
  );
}