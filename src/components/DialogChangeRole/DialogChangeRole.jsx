import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, Shield, User, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DialogChangeRole({ open, onOpenChange, selectedUser, onConfirm, loading }) {
  const selectedRole = selectedUser?.role?.toLowerCase() || "user";
  const selectedUserId = selectedUser?._id || selectedUser?.id || "new";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/55" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-2xl dark:bg-slate-900">
          <Dialog.Close className="absolute right-4 top-4 rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </Dialog.Close>
          <Dialog.Title className="text-lg font-bold">Change User Role</Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Select the new role for {selectedUser?.username || "this user"}.
          </Dialog.Description>
          <RoleForm
            key={`${selectedUserId}-${selectedRole}`}
            initialRole={selectedRole}
            loading={loading}
            onCancel={() => onOpenChange(false)}
            onConfirm={onConfirm}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function RoleForm({ initialRole, loading, onCancel, onConfirm }) {
  const [role, setRole] = useState(initialRole);

  return (
    <>
      <label className="mt-5 block text-sm font-semibold">Select Role</label>
      <Select.Root value={role} onValueChange={setRole}>
        <Select.Trigger className="mt-2 flex h-11 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
          <Select.Value />
          <Select.Icon>
            <ChevronDown className="h-4 w-4" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="z-[60] max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <Select.Viewport>
              <RoleItem value="user" icon={User} label="User" />
              <RoleItem value="admin" icon={Shield} label="Admin" />
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" disabled={loading} onClick={() => onConfirm(role)}>
          {loading ? "Saving..." : "Save Role"}
        </Button>
      </div>
    </>
  );
}

function RoleItem({ value, icon: Icon, label }) {
  return (
    <Select.Item value={value} className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-3 pr-9 text-sm outline-none hover:bg-slate-100 data-[highlighted]:bg-slate-100 dark:hover:bg-slate-800 dark:data-[highlighted]:bg-slate-800">
      <Select.ItemText>
        <span className="inline-flex items-center gap-2">
          <Icon className="h-4 w-4" /> {label}
        </span>
      </Select.ItemText>
      <Select.ItemIndicator className="absolute right-3 inline-flex">
        <Check className="h-4 w-4" />
      </Select.ItemIndicator>
    </Select.Item>
  );
}
