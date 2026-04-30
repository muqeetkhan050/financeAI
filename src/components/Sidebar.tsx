'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export function Sidebar() {
 


  return (
    <aside className="h-screen w-56 border-r border-gray-200 bg-white p-4">
      <nav>
        <ul className="flex flex-col gap-1">
              <li>
            <Link href='/dashboard' className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Dashboard
            </Link>
            </li>
        
           <li>

            <Link href='/dashboard/crypto' className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Crypto Dashboard
            </Link>
          </li>
          <li>
            <Link href='/dashboard/forex' className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Forex Dashboard
            </Link>
            </li>
              <li><Link href='/dashboard/chat' className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Chat
            </Link></li>
          
        
        </ul>
      </nav>
    </aside>
  );
}