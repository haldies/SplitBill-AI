import React, { useState } from 'react';
import ItemSelector from "./components/ItemSelector";
import UploadForm from "./components/UploadForm";
import ResultDisplay from './components/ResultDisplay';
import FriendInput from './components/FriendInput';

function App() {
  const [items, setItems] = useState([]);
  const [result, setResult] = useState(null);
  const [friends, setFriends] = useState([]);
  const [namesSet, setNamesSet] = useState(false);

  const handleSetFriends = (newFriends) => {
    setFriends(newFriends);
    setNamesSet(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FA]">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#3A6B7A] mb-2">SplitBill AI</h1>
          <p className="text-[#5D8B9C]">Split receipts effortlessly with friends</p>
        </header>
        {namesSet && (
          <button
            onClick={() => {
              setItems([]);
              setResult(null);
              setNamesSet(false);
            }}
            className="w-full py-3 px-4 bg-[#8DBCC7] hover:bg-[#7CA9B4] text-white rounded-lg transition-colors font-medium"
          >
            Start New Bill
          </button>
        )}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-[#E0EDF1]">
          {!namesSet && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#5D8B9C]">👥 Add Friends</h2>
              <FriendInput onSetFriends={handleSetFriends} />
            </div>
          )}

          {namesSet && !items.length && !result && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#5D8B9C]">Upload Receipt</h2>
              <UploadForm onExtracted={setItems} />
            </div>
          )}

          {items.length > 0 && !result && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#5D8B9C]">🛒 Select Items</h2>
              <ItemSelector items={items} friends={friends} onDone={setResult} />
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#5D8B9C]">💸 Split Results</h2>
              <ResultDisplay result={result} items={items} />
            </div>
          )}
        </div>


      </div>
    </div>
  )
}

export default App