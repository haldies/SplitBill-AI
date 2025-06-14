import React, { useState } from "react";

export default function FriendInput({ onSetFriends }) {
  const [friends, setFriends] = useState(["Andi", "Budi", "Cici", "Deni"]);

  const handleChange = (idx, value) => {
    const updated = [...friends];
    updated[idx] = value;
    setFriends(updated);
  };

  const handleAddFriend = () => {
    setFriends([...friends, ""]);
  };

  const handleRemoveFriend = (idx) => {
    if (friends.length <= 1) return;
    const updated = friends.filter((_, i) => i !== idx);
    setFriends(updated);
  };

  const handleDone = () => {
    const cleaned = friends.filter((name) => name.trim() !== "");
    onSetFriends(cleaned.length > 0 ? cleaned : ["Andi", "Budi", "Cici", "Deni"]);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E0EDF1] shadow-sm">
      <h2 className="text-[#3A6B7A] font-medium text-lg mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        Add Friends
      </h2>
      
      <div className="space-y-3 mb-4">
        {friends.map((name, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              className="flex-1 border border-[#E0EDF1] focus:border-[#8DBCC7] focus:ring-1 focus:ring-[#8DBCC7] rounded-lg px-4 py-2 outline-none transition-all"
              value={name}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder={`Friend ${idx + 1}`}
            />
            {friends.length > 1 && (
              <button 
                onClick={() => handleRemoveFriend(idx)}
                className="p-2 text-[#FF6B6B] hover:text-[#E05555] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={handleAddFriend}
          className="flex items-center justify-center gap-2 bg-[#F5F9FA] hover:bg-[#E0EDF1] text-[#3A6B7A] py-2 px-4 rounded-lg transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Friend
        </button>
        
        <button 
          onClick={handleDone}
          className="flex-1 flex items-center justify-center gap-2 bg-[#8DBCC7] hover:bg-[#7CA9B4] text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Confirm Friends
        </button>
      </div>
    </div>
  );
}