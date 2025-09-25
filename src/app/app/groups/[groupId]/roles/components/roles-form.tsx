"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import Reveal from "@/components/animations/Reveal";

interface RoleFormProps {
  initialCode?: string;
  initialName?: string;
  initialPermissions?: string[];
  isDefaultCode?: boolean;
  onSave: (data: { code: string; name: string; permissions: string[] }) => void;
  onCancel: () => void;
}

export default function RoleForm({
  initialCode = "",
  initialName = "",
  initialPermissions = [],
  isDefaultCode = false,
  onSave,
  onCancel,
}: RoleFormProps) {
  const [code, setCode] = useState(initialCode);
  const [name, setName] = useState(initialName);
  const [permissions, setPermissions] = useState(initialPermissions.join(", "));

  const handleSave = () => {
    onSave({
      code: code.toLowerCase().replace(/\s+/g, ""),
      name,
      permissions: permissions
        ? permissions.split(",").map((p) => p.trim())
        : [],
    });
  };

  return (
    <Reveal animation="fadeIn">
      <div className="flex flex-col gap-2">
        {!isDefaultCode && (
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code (lowercase, no spaces)"
          />
        )}
        {isDefaultCode && (
          <Input value={code} disabled className="opacity-70" />
        )}
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Role name"
        />
        <Input
          value={permissions}
          onChange={(e) => setPermissions(e.target.value)}
          placeholder="Permissions (comma separated)"
        />
        <div className="flex gap-2">
          <Button variant="primary-outline" onClick={handleSave}>
            <Save />
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            <X />
          </Button>
        </div>
      </div>
    </Reveal>
  );
}