"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Lead {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  redesSociais: Record<string, string>;
  audiencia: string;
  nicho: string;
  timestamp: { toDate?: () => Date } | null;
  status: string;
  anotacoes?: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});

  // Senha de acesso (você pode mudar depois)
  const ADMIN_PASSWORD = 'low369admin';

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData: Lead[] = [];
      snapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(leadsData);
      setFilteredLeads(leadsData);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.cidade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(lead => {
        const leadDate = lead.timestamp?.toDate?.();
        if (!leadDate) return false;
        const filterDate = new Date(dateFilter);
        return leadDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredLeads(filtered);
  }, [searchTerm, statusFilter, dateFilter, leads]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead permanentemente?')) return;
    
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      setSelectedLead(null);
      alert('Lead excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      alert('Erro ao excluir lead.');
    }
  };

  const saveLeadNotes = async (leadId: string, notes: string) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), { anotacoes: notes });
      alert('Anotações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar anotações:', error);
      alert('Erro ao salvar anotações.');
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Cidade', 'Estado', 'Redes Sociais', 'Audiência', 'Nicho', 'Data', 'Status'];
    const rows = filteredLeads.map(lead => [
      lead.nome,
      lead.email,
      lead.whatsapp,
      lead.cidade,
      lead.estado,
      Object.entries(lead.redesSociais || {}).map(([k, v]) => `${k}: ${v}`).join('; '),
      lead.audiencia,
      lead.nicho,
      lead.timestamp?.toDate?.()?.toLocaleString() || 'N/A',
      lead.status
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-low369-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getLeadsToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return leads.filter(lead => {
      const leadDate = lead.timestamp?.toDate?.();
      return leadDate && leadDate >= today;
    }).length;
  };

  const getLeadsThisWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return leads.filter(lead => {
      const leadDate = lead.timestamp?.toDate?.();
      return leadDate && leadDate >= weekAgo;
    }).length;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
              LOW369 Admin
            </h1>
            <p className="text-gray-600">Digite a senha para acessar</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-2xl border-2 border-gray-200 px-4 text-gray-800 font-medium focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all"
                placeholder="Digite a senha"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold hover:scale-105 transition-transform"
            >
              🔓 Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span className="text-3xl">🏎️</span> LOW369 Dashboard
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 text-white">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-black">{leads.length}</div>
            <div className="text-blue-100">Total de Leads</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-6 text-white">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-3xl font-black">{getLeadsToday()}</div>
            <div className="text-green-100">Leads Hoje</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-black">{getLeadsThisWeek()}</div>
            <div className="text-purple-100">Últimos 7 Dias</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">🔍 Buscar</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, email ou cidade..."
                className="w-full h-12 rounded-xl bg-white/20 border border-white/30 px-4 text-white placeholder-white/60 focus:bg-white/30 focus:border-orange-400 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-semibold mb-2">📋 Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/20 border border-white/30 px-4 text-white focus:bg-white/30 focus:border-orange-400 transition-all"
              >
                <option value="todos">Todos</option>
                <option value="novo">Novo</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-semibold mb-2">📅 Data</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/20 border border-white/30 px-4 text-white focus:bg-white/30 focus:border-orange-400 transition-all"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={exportToCSV}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:scale-105 transition-transform"
              >
                📥 Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{lead.nome}</h3>
                  <p className="text-white/70">📧 {lead.email}</p>
                  <p className="text-white/70">📱 {lead.whatsapp}</p>
                  <p className="text-white/70">📍 {lead.cidade}, {lead.estado}</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    lead.status === 'novo' ? 'bg-blue-500 text-white' :
                    lead.status === 'aprovado' ? 'bg-green-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {lead.status === 'novo' ? '🆕 Novo' :
                     lead.status === 'aprovado' ? '✅ Aprovado' :
                     '❌ Rejeitado'}
                  </span>
                  
                  <span className="text-white/60 text-sm">
                    {lead.timestamp?.toDate?.()?.toLocaleString() || 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-300 text-sm">
                  📊 {lead.audiencia}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm">
                  🎯 {lead.nicho}
                </span>
              </div>
            </div>
          ))}
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-white/60">
              Nenhum lead encontrado
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900">{selectedLead.nome}</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <p className="text-gray-900 font-medium">{selectedLead.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600">WhatsApp</label>
                <p className="text-gray-900 font-medium">{selectedLead.whatsapp}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Cidade</label>
                  <p className="text-gray-900 font-medium">{selectedLead.cidade}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Estado</label>
                  <p className="text-gray-900 font-medium">{selectedLead.estado}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600">Redes Sociais</label>
                <div className="space-y-2 mt-2">
                  {Object.entries(selectedLead.redesSociais || {}).map(([rede, link]) => (
                    <div key={rede} className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">{rede}:</span>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Audiência</label>
                  <p className="text-gray-900 font-medium">{selectedLead.audiencia}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Nicho</label>
                  <p className="text-gray-900 font-medium">{selectedLead.nicho}</p>
                </div>
              </div>
              
              {/* Campo de Anotações */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">📝 Anotações de Pré-Análise</label>
                <textarea
                  value={leadNotes[selectedLead.id] || selectedLead.anotacoes || ''}
                  onChange={(e) => setLeadNotes({...leadNotes, [selectedLead.id]: e.target.value})}
                  placeholder="Adicione suas anotações sobre este lead..."
                  className="w-full h-32 rounded-xl border-2 border-gray-300 px-4 py-3 text-gray-800 resize-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all"
                />
                <button
                  onClick={() => saveLeadNotes(selectedLead.id, leadNotes[selectedLead.id] || selectedLead.anotacoes || '')}
                  className="mt-2 px-6 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
                >
                  💾 Salvar Anotações
                </button>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Alterar Status</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateLeadStatus(selectedLead.id, 'novo')}
                    className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
                  >
                    🆕 Novo
                  </button>
                  <button
                    onClick={() => updateLeadStatus(selectedLead.id, 'aprovado')}
                    className="flex-1 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors"
                  >
                    ✅ Aprovar
                  </button>
                  <button
                    onClick={() => updateLeadStatus(selectedLead.id, 'rejeitado')}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                  >
                    ❌ Rejeitar
                  </button>
                </div>
              </div>
              
              {/* Botão de Excluir Lead */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => deleteLead(selectedLead.id)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
                >
                  🗑️ Excluir Lead Permanentemente
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  ⚠️ Esta ação não pode ser desfeita
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

