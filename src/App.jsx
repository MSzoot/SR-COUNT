import { useState, useEffect } from "react";

const initialUsers = [];

const ranks = ["rekrut", "zasluzony", "raider"];

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [newNickname, setNewNickname] = useState("");
  const [newRank, setNewRank] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
      setUsers(storedUsers);
    }
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  const addPoints = (id, amount) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          points: user.points + amount,
          clicks:
            amount === 1
              ? (user.clicks || 0) + 1
              : amount === -1
              ? (user.clicks || 0) - 1
              : user.clicks || 0,
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const addUser = () => {
    if (newNickname && newRank) {
      const existingUser = users.find((user) => user.nickname === newNickname);
      if (existingUser) {
        alert("Gracz juz istnieje!");
        return;
      }

      let points = 0;
      switch (newRank) {
        case "rekrut":
          points = 0;
          break;
        case "zasluzony":
          points = -1;
          break;
        case "raider":
          points = -2;
          break;
        default:
          points = 0;
      }
      const newUser = {
        id: users.length + 1,
        nickname: newNickname,
        rank: newRank,
        points: points,
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Add notes for the new user
      const updatedNotes = { ...notes, [newUser.id]: "" };
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));

      setNewNickname("");
      setNewRank("");
    }
  };

  const deleteUser = () => {
    if (deleteUserId !== null) {
      const confirmed = window.confirm("Potwierdz usuniecie gracza z listy?");
      if (confirmed) {
        const updatedUsers = users.filter((user) => user.id !== deleteUserId);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Remove notes for the deleted user
        const updatedNotes = { ...notes };
        delete updatedNotes[deleteUserId];
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));

        setDeleteUserId(null);
      }
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem("users");
    localStorage.removeItem("notes");
    setUsers([]);
    setNotes({});
  };

  const editNotes = (userId) => {
    const updatedNotes = { ...notes };
    const newNote = prompt("Edit notes:", updatedNotes[userId]);
    if (newNote !== null) {
      updatedNotes[userId] = newNote;
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }
  };

  return (
    <div>
      <h1 className="mx-auto mb-20 p-6 text-center text-4xl">
        Purpurowa KomitywaSR+ Tracker
      </h1>
      <div className="flex justify-center">
        <table>
          {users.length > 0 && (
            <thead>
              <tr className="text-gray-700">
                <th>Nick</th>
                <th>Ranga</th>
                <th>SR+</th>
                <th>Loot</th>
                <th>Itemy</th>
                <th className="px-4">Notatki</th>
              </tr>
            </thead>
          )}
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4">{user.nickname}</td>
                <td className="px-4">{user.rank}</td>
                <td className="px-4">{user.points}</td>
                <td>
                  <button
                    className="btn btn-sm text-lg hover:btn-success"
                    onClick={() => addPoints(user.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-sm text-lg hover:btn-error"
                    onClick={() => addPoints(user.id, -1)}
                  >
                    -
                  </button>
                </td>
                <td className="text-center">{user.clicks || 0}</td>
                <td className="text-center">{notes[user.id] || ""}</td>
                <td>
                  <button
                    className="btn btn-sm ml-10 text-lg hover:btn-primary"
                    onClick={() => editNotes(user.id)}
                  >
                    🗒️
                  </button>
                  <button
                    className="btn btn-sm hover:btn-error"
                    onClick={() => setDeleteUserId(user.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-20 flex justify-center border-t-2 border-base-300 pt-10">
        <input
          type="text"
          placeholder="Nick"
          value={newNickname}
          className="input-bordered input mr-1 w-full max-w-xs"
          onChange={(e) => setNewNickname(e.target.value)}
        />
        <select
          value={newRank}
          className="select-bordered select mr-1 max-w-xs"
          onChange={(e) => setNewRank(e.target.value)}
        >
          <option disabled value="">
            Ranga
          </option>
          {ranks.map((rank) => (
            <option key={rank} value={rank}>
              {rank}
            </option>
          ))}
        </select>
        <button className="btn-success btn" onClick={addUser}>
          Dodaj
        </button>
      </div>
      {deleteUserId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <p className="mb-4 text-xl text-gray-700">Usunac gracza z listy?</p>
            <div className="flex justify-center">
              <button
                className="btn mr-4 bg-red-800 text-white"
                onClick={deleteUser}
              >
                Tak
              </button>
              <button
                className="btn bg-gray-400 text-white"
                onClick={() => setDeleteUserId(null)}
              >
                Nie
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-40 flex justify-center">
        <button
          className="btn bg-red-800 hover:bg-red-600"
          onClick={resetLocalStorage}
        >
          Usun Liste
        </button>
      </div>
    </div>
  );
}

export default App;
