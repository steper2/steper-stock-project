import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';

export default function SimpleStockStorage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await window.storage.get('stock-items');
      if (data?.value) {
        setItems(JSON.parse(data.value));
      }
    } catch (error) {
      console.log('첫 로딩');
    }
  };

  const addItem = () => {
    if (!title.trim()) return;
    
    const newItem = {
      id: Date.now(),
      title: title,
      content: content,
      date: new Date().toLocaleDateString('ko-KR')
    };
    
    const updated = [newItem, ...items];
    setItems(updated);
    saveItems(updated);
    setTitle('');
    setContent('');
  };

  const deleteItem = (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    saveItems(updated);
  };

  const saveItems = async (data) => {
    try {
      await window.storage.set('stock-items', JSON.stringify(data));
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Steper 주식 프로젝트
          </h1>
          <p className="text-blue-200">자료를 저장하고 관리하세요</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className="w-full bg-white/10 text-white placeholder-blue-300 px-4 py-3 rounded-lg outline-none border border-white/20 mb-4 text-lg"
          />
          <textarea
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-blue-300 px-4 py-3 rounded-lg outline-none border border-white/20 mb-4 resize-none"
            rows="4"
          />
          <button
            onClick={addItem}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            추가하기
          </button>
        </div>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/10">
              <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-lg">저장된 자료가 없습니다</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-300 hover:text-red-200 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {item.content && (
                  <p className="text-gray-300 whitespace-pre-wrap mb-3">
                    {item.content}
                  </p>
                )}
                <p className="text-blue-400 text-sm">{item.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}