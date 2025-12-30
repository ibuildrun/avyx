
import React, { useState, useRef, useEffect } from 'react';
import { Task, Category, Screen, User } from '../types';
import { MOCK_TASKS, MOCK_USERS } from '../constants';
import Avatar from '../components/Avatar';

// Fix: Added user property to props interface
interface SearchScreenProps {
  user: User;
  onTaskSelect: (task: Task) => void;
}

type BudgetFilter = 'all' | 'low' | 'mid' | 'high';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

// Fix: Destructured user from props
const SearchScreen: React.FC<SearchScreenProps> = ({ user, onTaskSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>('all');
  const [showFilters, setShowFilters] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const categories: Category[] = ['Все', 'UI/UX', 'Графика', 'Иллюстрация', 'Логотипы'];

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const parseBudget = (budgetString: string): number => {
    return parseInt(budgetString.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const filteredTasks = MOCK_TASKS.filter(task => {
    const q = searchQuery.toLowerCase().trim();
    
    const matchesSearch = !q || (
      task.title.toLowerCase().includes(q) || 
      task.description.toLowerCase().includes(q) ||
      task.author.toLowerCase().includes(q)
    );

    const matchesCategory = selectedCategory === 'Все' || task.category === selectedCategory;

    const budget = parseBudget(task.budget);
    let matchesBudget = true;
    if (budgetFilter === 'low') matchesBudget = budget < 12000;
    else if (budgetFilter === 'mid') matchesBudget = budget >= 12000 && budget <= 20000;
    else if (budgetFilter === 'high') matchesBudget = budget > 20000;

    let matchesDiff = true;
    if (diffFilter === 'easy') matchesDiff = task.difficulty <= 2;
    else if (diffFilter === 'medium') matchesDiff = task.difficulty === 3;
    else if (diffFilter === 'hard') matchesDiff = task.difficulty >= 4;

    return matchesSearch && matchesCategory && matchesBudget && matchesDiff;
  });

  const matchedUsers = searchQuery.length > 1 
    ? MOCK_USERS.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
        user.nickname.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        user.specialty.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : [];

  const resetFilters = () => {
    setSelectedCategory('Все');
    setBudgetFilter('all');
    setDiffFilter('all');
    setSearchQuery('');
  };

  const renderDifficulty = (level: number) => {
    return (
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= level ? 'bg-[#FF7F50]' : 'bg-gray-200'}`}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-black tracking-tight">Поиск заказов</h1>
        
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Что ищем сегодня?..."
              className="w-full bg-white p-4 pl-12 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#FF7F50]/20 outline-none transition-all placeholder:text-gray-300 font-bold text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-4 text-gray-300 transition-colors group-focus-within:text-[#FF7F50]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 rounded-2xl shadow-sm border transition-all active:scale-95 ${showFilters ? 'coral-gradient text-white border-transparent' : 'bg-white text-gray-400 border-gray-50'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-[32px] shadow-xl border border-gray-50 space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Фильтры</h4>
              <button onClick={resetFilters} className="text-[10px] font-black text-[#FF7F50] uppercase underline decoration-2 underline-offset-4">Очистить</button>
            </div>
            
            <div className="space-y-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Категория</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${selectedCategory === cat ? 'bg-orange-50 text-[#FF7F50] border-orange-100' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Бюджет</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {id: 'all', label: 'Все'},
                  {id: 'low', label: '< 12к'},
                  {id: 'mid', label: '12-20к'},
                  {id: 'high', label: '20к+'}
                ].map(range => (
                  <button 
                    key={range.id} 
                    onClick={() => setBudgetFilter(range.id as BudgetFilter)}
                    className={`py-2 rounded-xl text-[10px] font-black transition-all border ${budgetFilter === range.id ? 'bg-orange-50 text-[#FF7F50] border-orange-100' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Сложность</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {id: 'all', label: 'Любая'},
                  {id: 'easy', label: 'Легко'},
                  {id: 'medium', label: 'Средне'},
                  {id: 'hard', label: 'Профи'}
                ].map(level => (
                  <button 
                    key={level.id} 
                    onClick={() => setDiffFilter(level.id as DifficultyFilter)}
                    className={`py-2 rounded-xl text-[10px] font-black transition-all border ${diffFilter === level.id ? 'bg-orange-50 text-[#FF7F50] border-orange-100' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-8">
        {matchedUsers.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1">Люди</h3>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {matchedUsers.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-50 flex flex-col items-center text-center min-w-[120px] gap-2">
                  <Avatar src={user.avatar} type={user.type as any} size="lg" />
                  <div className="text-[10px] font-black truncate w-24 leading-none">{user.name}</div>
                  <div className="text-[8px] bg-orange-50 text-[#FF7F50] px-2 py-0.5 rounded font-black">
                    {user.rating} ★
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1">
            Найдено заказов: {filteredTasks.length}
          </h3>
          
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => onTaskSelect(task)}
                  className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 transition-all active:scale-[0.98] group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <span className="text-[#FF7F50] text-[9px] font-black uppercase tracking-widest">{task.category}</span>
                      <h3 className="font-black text-base leading-tight group-hover:text-[#FF7F50] transition-colors">{task.title}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <Avatar src={`https://i.pravatar.cc/100?u=${task.author}`} type={task.authorType} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black">{task.author}</span>
                        <span className="text-[10px] text-[#FF7F50] font-black leading-none">{task.budget}</span>
                      </div>
                    </div>
                    <button className="coral-gradient text-white px-5 py-2 rounded-2xl text-[9px] font-black uppercase shadow-lg shadow-orange-100">
                      Смотреть
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
               <div className="text-5xl mb-4 grayscale">🛸</div>
               <h3 className="font-black text-gray-400 uppercase text-xs">Ничего не нашли</h3>
               <button onClick={resetFilters} className="mt-4 text-[#FF7F50] text-[10px] font-black uppercase underline decoration-2">Сбросить поиск</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchScreen;
