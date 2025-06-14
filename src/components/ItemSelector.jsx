import React, { useState } from "react";

export default function ItemSelector({ items, friends, onDone }) {
    const [selectedFriend, setSelectedFriend] = useState("");
    const [friendOrders, setFriendOrders] = useState({});
    const [currentView, setCurrentView] = useState("selectFriend");

    const handleFriendSelect = (friend) => {
        setSelectedFriend(friend);
        setCurrentView("selectItems");

        // Initialize orders if not exists
        if (!friendOrders[friend]) {
            setFriendOrders(prev => ({
                ...prev,
                [friend]: {}
            }));
        }
    };

    const handleQuantityChange = (itemId, quantity) => {
        setFriendOrders(prev => {
            const newOrders = { ...prev };
            if (quantity > 0) {
                newOrders[selectedFriend][itemId] = quantity;
            } else {
                delete newOrders[selectedFriend][itemId];
            }
            return newOrders;
        });
    };

    const handleBackToFriends = () => {
        setCurrentView("selectFriend");
    };

    const handleSubmit = () => {
        const result = {};

        // Calculate totals for each friend
        Object.entries(friendOrders).forEach(([friend, orders]) => {
            let total = 0;
            const itemsList = {};

            Object.entries(orders).forEach(([itemId, qty]) => {
                const item = items.find(i => i.item === itemId);
                if (item) {
                    const itemTotal = item.price * qty;
                    total += itemTotal;
                    itemsList[itemId] = {
                        name: item.item,
                        price: item.price,
                        quantity: qty,
                        subtotal: itemTotal
                    };
                }
            });

            result[friend] = {
                total,
                items: itemsList
            };
        });

        onDone(result);
    };
    // Calculate which friends have orders
    const friendsWithOrders = Object.keys(friendOrders).filter(
        friend => Object.keys(friendOrders[friend]).length > 0
    );

    return (
        <div className="bg-white rounded-xl p-6 border border-[#E0EDF1] shadow-sm">
            {currentView === "selectFriend" ? (
                <>
                    <h2 className="text-[#3A6B7A] font-medium text-lg mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Select Friend
                    </h2>

                    {friendsWithOrders.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-[#5D8B9C] mb-2">Friends with orders:</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {friendsWithOrders.map(friend => (
                                    <span
                                        key={friend}
                                        className="bg-[#E0EDF1] text-[#3A6B7A] px-3 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {friend}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFriendSelect(friend);
                                            }}
                                            className="ml-2 text-[#5D8B9C] hover:text-[#3A6B7A]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 mb-6">
                        {friends.map((friend) => (
                            <button
                                key={friend}
                                onClick={() => handleFriendSelect(friend)}
                                className={`w-full text-left ${friendOrders[friend] && Object.keys(friendOrders[friend]).length > 0 ? 'bg-[#E0EDF1]' : 'bg-[#F5F9FA]'} hover:bg-[#E0EDF1] text-[#3A6B7A] p-4 rounded-lg transition-colors flex justify-between items-center`}
                            >
                                {friend}
                                {friendOrders[friend] && Object.keys(friendOrders[friend]).length > 0 && (
                                    <span className="text-sm text-[#5D8B9C]">
                                        {Object.keys(friendOrders[friend]).length} item(s) selected
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center mb-6">
                        <button
                            onClick={handleBackToFriends}
                            className="mr-3 text-[#5D8B9C] hover:text-[#3A6B7A]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <h2 className="text-[#3A6B7A] font-medium text-lg">
                            {selectedFriend}'s Order
                        </h2>
                    </div>

                    <div className="space-y-4 mb-6">
                        {items.map((item) => (
                            <div key={item.item} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="font-medium text-[#3A6B7A]">{item.item}</div>
                                    <div className="text-sm text-[#5D8B9C]">
                                        {item.price != null ? `Rp${item.price.toLocaleString()}` : <span className="text-red-400">Harga tidak tersedia</span>}
                                    </div>

                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.item, (friendOrders[selectedFriend][item.item] || 0) - 1)}
                                        disabled={(friendOrders[selectedFriend][item.item] || 0) <= 0}
                                        className="w-8 h-8 flex items-center justify-center bg-[#F5F9FA] hover:bg-[#E0EDF1] text-[#3A6B7A] rounded-full disabled:opacity-50"
                                    >
                                        -
                                    </button>

                                    <span className="w-8 text-center">
                                        {friendOrders[selectedFriend][item.item] || 0}
                                    </span>

                                    <button
                                        onClick={() => handleQuantityChange(item.item, (friendOrders[selectedFriend][item.item] || 0) + 1)}
                                        className="w-8 h-8 flex items-center justify-center bg-[#F5F9FA] hover:bg-[#E0EDF1] text-[#3A6B7A] rounded-full"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleBackToFriends}
                        className="w-full mb-3 flex items-center justify-center gap-2 bg-[#F5F9FA] hover:bg-[#E0EDF1] text-[#3A6B7A] py-3 px-4 rounded-lg transition-colors font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        Add or Edit Another Friend
                    </button>
                </>
            )}

            <button
                onClick={handleSubmit}
                disabled={friendsWithOrders.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#8DBCC7] hover:bg-[#7CA9B4] text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                Calculate Totals
            </button>
        </div>
    );
}