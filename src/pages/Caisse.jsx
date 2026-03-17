import React from 'react'
import { Search } from 'lucide-react'
import { useStore } from '../context/StoreContext';
export default function Caisse() {
   const [SearchTerm, setSearchTerm] = React.useState('');
 {/* const [selectedCategory, setSelectedCategory] = React.useState('all');
   const category = ['ALL', ...Array.from(new Set(Produit.map(p => p.category)))];

   const filteredProducts = Produit.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(SearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
   });*/}
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
        {/* produit card */}
        <div className='flex-1 flex gap-6'>
            <div className=' bg-white border shadow-sm p-4 flex-col flex gap-3 border-slate-400 rounded-2xl ' >
            <div className='flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 focus-within:border-blue-500  focus-within:ring-blue-100 transition-all'>
                <Search className='w-5 h-5 text-slate-400' />
                <input type="text" 
                placeholder="Rechercher un produit..."
                className="bg-transparent border-none focus:ring-0 text-slate-700 outline-none "
                value={SearchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                />
            </div>
        </div>
        </div>
        
        {/* card droite*/}
        
    </div>
  )
}
