import { useEffect, useState } from "react";
import {
  type User,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type UpsertUserDto,
} from "../services/users.service";

export function useUsers() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getUsers();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create(data: UpsertUserDto) {
    const created = await createUser(data);
    setItems((prev) => [...prev, created]);
  }

  async function update(id: number, data: UpsertUserDto) {
    const updated = await updateUser(id, data);
    setItems((prev) => prev.map((u) => (u.id === id ? updated : u)));
  }

  async function remove(id: number) {
    await deleteUser(id);
    setItems((prev) => prev.filter((u) => u.id !== id));
  }

  return { items, loading, create, update, remove, reload: load };
}
