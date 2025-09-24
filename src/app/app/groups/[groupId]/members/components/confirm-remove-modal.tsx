"use client";

import Reveal from "@/components/animations/Reveal";
import { Button } from "@/components/ui/button";

interface ConfirmRemoveModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  memberName?: string | null
}

export default function ConfirmRemoveModal({
  open,
  onConfirm,
  onCancel,
  memberName,
}: ConfirmRemoveModalProps) {
  if (!open) return null;

  return (
    <Reveal animation="fadeIn">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Reveal delay={0.2}>
          <div className="bg-background rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-2">Remove Member</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-medium">{memberName}</span> dari group ini?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm}>
                Remove
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </Reveal>
  );
}