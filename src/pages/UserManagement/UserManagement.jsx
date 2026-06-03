import { KeyRound, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DialogChangeRole from "@/components/DialogChangeRole/DialogChangeRole";
import DialogConfirm from "@/components/DialogConfirm/DialogConfirm";
import { usersApi } from "@/components/services/api/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Table, Td, Th } from "@/components/ui/table";
import { getApiErrorMessage, isNetworkError } from "@/utils/apiError";
import { getItems } from "@/utils/apiData";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUser, setDeleteUser] = useState(null);
  const [roleUser, setRoleUser] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadUsers() {
      try {
        const data = await usersApi.getAll();
        if (active) setUsers(getItems(data));
      } catch (error) {
        if (!isNetworkError(error)) {
          toast.error(getApiErrorMessage(error, "Could not load users"));
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const removeUser = async () => {
    if (!deleteUser) return;
    setSaving(true);
    try {
      await usersApi.delete(deleteUser._id || deleteUser.id);
      setUsers((value) => value.filter((user) => (user._id || user.id) !== (deleteUser._id || deleteUser.id)));
      setDeleteUser(null);
      toast.success("User deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete user"));
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (role) => {
    if (!roleUser) return;
    setSaving(true);
    try {
      const id = roleUser._id || roleUser.id;
      await usersApi.changeRole(id, role);
      setUsers((value) => value.map((user) => ((user._id || user.id) === id ? { ...user, role } : user)));
      setRoleUser(null);
      toast.success("Role updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update role"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-10 flex items-center justify-center gap-3 text-4xl font-bold text-indigo-600 sm:text-5xl">
        <span aria-hidden="true">🧩</span> User Management
      </h1>
      {loading ? (
        <Spinner label="Loading users..." />
      ) : (
        <div className="min-h-[420px] rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
          <Table>
            <thead>
              <tr>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th className="w-36 text-center">Action</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <Td className="font-semibold">{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge variant={user.role === "admin" ? "admin" : "default"}>{user.role}</Badge>
                  </Td>
                  <Td className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        size="icon"
                        variant="danger"
                        className="h-9 w-11 rounded-[10px] bg-red-500 text-white shadow-none hover:bg-red-600"
                        aria-label={`Delete ${user.username}`}
                        onClick={() => setDeleteUser(user)}
                      >
                        <Trash2 className="h-5 w-5 stroke-[2.5]" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-11 rounded-[10px] bg-indigo-50 text-indigo-600 shadow-none hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                        aria-label={`Change role for ${user.username}`}
                        onClick={() => setRoleUser(user)}
                      >
                        <KeyRound className="h-5 w-5 stroke-[2.5]" />
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {users.length === 0 && <div className="grid min-h-80 place-items-center text-slate-500">No users found.</div>}
        </div>
      )}
      <DialogConfirm
        open={Boolean(deleteUser)}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        title="Delete this user?"
        description="This user account will be permanently removed."
        onConfirm={removeUser}
        loading={saving}
      />
      <DialogChangeRole
        open={Boolean(roleUser)}
        onOpenChange={(open) => !open && setRoleUser(null)}
        selectedUser={roleUser}
        onConfirm={changeRole}
        loading={saving}
      />
    </section>
  );
}
