import { useState, useEffect } from "react";

const initialUsers = [];

const ranks = ["rekrut", "zasluzony", "raider"];

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [newNickname, setNewNickname] = useState("");
  const [newRank, setNewRank] = useState("");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
      setUsers(storedUsers);
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
      setNewNickname("");
      setNewRank("");
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem("users");
    setUsers([]);
  };

  return (
    <div>
      <h1 className="mx-auto mb-20 p-6  text-center text-4xl">
        Purpurowa komitywa SR+ Tracker
      </h1>
      <div className="flex justify-center">
        <table>
          {users.length > 0 && (
            <thead>
              <tr className="text-gray-700 ">
                <th>Nick</th>
                <th>Ranga</th>
                <th>SR+</th>
                <th>Akcja</th>
                <th>Otrzymane itemy</th>
              </tr>
            </thead>
          )}
          <tbody className="">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6">{user.nickname}</td>
                <td className="px-6">{user.rank}</td>
                <td className="px-6">{user.points}</td>
                <td>
                  <button
                    className="btn-success btn"
                    onClick={() => addPoints(user.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn-error btn"
                    onClick={() => addPoints(user.id, -1)}
                  >
                    -
                  </button>
                </td>
                <td className="text-center">{user.clicks || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-20 flex justify-center">
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
