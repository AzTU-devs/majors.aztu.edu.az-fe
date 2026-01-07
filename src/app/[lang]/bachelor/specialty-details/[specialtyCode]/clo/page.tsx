import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import React from 'react'

export default function page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className='flex justify-center items-center'>
          <ul>
            <li className="flex-1 min-w-[400px] mb-[10px] border border-[rgba(0,0,0,0.2)] bg-[#182f79] text-white transition-colors duration-300 p-4 rounded cursor-pointer group">
              İnformasiya texnalogiyaları üçün təlim nəticəsi
            </li>
            <li className="flex-1 min-w-[400px] mb-[10px] border border-[rgba(0,0,0,0.2)] bg-[#182f79] text-white transition-colors duration-300 p-4 rounded cursor-pointer group">
              Informasiya texnalogiyaları üçün təlim nəticəsi 2
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}
  