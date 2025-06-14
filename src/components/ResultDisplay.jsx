import React from "react";

export default function ResultDisplay({ result }) {
    const generateShareText = () => {
        let text = "Rincian Tagihan:\n\n";

        for (const [name, { total, items }] of Object.entries(result)) {
            text += `Nama: ${name}\n`;
            text += `Total: Rp${total.toLocaleString("id-ID")}\n\n`;
            for (const item of Object.values(items)) {
                text += `- ${item.name} (${item.quantity} x Rp${item.price.toLocaleString("id-ID")}) = Rp${item.subtotal.toLocaleString("id-ID")}\n`;
            }

        }

        return encodeURIComponent(text);
    };



    const whatsappLink = `https://wa.me/?text=${generateShareText()}`;

    return (
        <div className="mt-6 p-6 rounded-xl border border-[#E0EDF1] bg-[#F5F9FA] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <h2 className="text-[#3A6B7A] font-medium text-lg">Bill Breakdown</h2>
            </div>

            <div className="space-y-6">
                {Object.entries(result).map(([name, { total, items }]) => (
                    <div key={name} className="bg-white rounded-lg border border-[#E0EDF1] p-4">
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#E0EDF1]">
                            <h3 className="text-[#3A6B7A] font-medium">{name}</h3>
                            <span className="text-[#3A6B7A] font-bold">Total: Rp{total.toLocaleString("id-ID")}</span>
                        </div>

                        <ul className="space-y-3">
                            {Object.values(items).map((item) => (
                                <li key={item.name} className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <span className="text-[#3A6B7A]">{item.name}</span>
                                        <span className="text-sm text-[#5D8B9C] ml-2">
                                            (x{item.quantity} @ Rp{item.price.toLocaleString("id-ID")})
                                        </span>
                                    </div>
                                    <span className="text-[#3A6B7A]">
                                        Rp{item.subtotal.toLocaleString("id-ID")}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Tombol Share WhatsApp */}
            <div className="mt-6 text-right">
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    Share via WhatsApp
                </a>
            </div>
        </div>
    );
}
