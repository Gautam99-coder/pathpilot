import { useParams } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminUserGroups() {

  const { id } = useParams();

  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const user = users.find(u => u.id === id);

  const addGroup = () => {
    const name = prompt("Enter group name");
    if (!name) return;

    user.groups.push({ name });

    localStorage.setItem("users", JSON.stringify(users));
    setUsers([...users]);
  };

  const deleteGroup = (index) => {
    user.groups.splice(index, 1);
    setUsers([...users]);
    localStorage.setItem("users", JSON.stringify(users));
  };

  return (
    <div className="flex h-screen bg-background-light">

      <AdminSidebar />

      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">
          {user?.name} Groups
        </h1>

        <button
          onClick={addGroup}
          className="mb-4 bg-primary text-white px-4 py-2 rounded-xl"
        >
          Add Group
        </button>

        <div className="bg-white rounded-2xl border">

          {user?.groups.map((g, i) => (
            <div key={i} className="flex justify-between p-4 border-b">

              <p>{g.name}</p>

              <button
                onClick={()=>deleteGroup(i)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
