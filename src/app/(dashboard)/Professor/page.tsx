"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { DashboardTabs } from "@/components/features/professor/DashboardTabs";
import { StudentsTable } from "@/components/features/professor/StudentsTable";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/ui/SearchBar";
import { UploadModal } from "@/components/features/professor/UploadModal";
import { FileManager } from "@/components/features/professor/FileManager";
import { AlertReport } from "@/components/features/professor/AlertReport";
import { ChatHistoryData } from "@/types/chat";
import { Student } from "@/types/student";
import { fetchStudents } from "@/lib/services/alunos";
import { fetchAllHistory } from "@/lib/services/historico";

export default function ProfessorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"alunos" | "arquivos" | "alertas">("alunos");
  const [refreshKey, setRefreshKey] = useState(0);
  const [alunos, setAlunos] = useState<Student[]>([]);
  const [isLoadingAlunos, setIsLoadingAlunos] = useState(true);
  const [allHistory, setAllHistory] = useState<ChatHistoryData[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  useEffect(() => {
    const loadAlunos = async () => {
      setIsLoadingAlunos(true);
      try {
        const data = await fetchStudents();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      } finally {
        setIsLoadingAlunos(false);
      }
    };
    loadAlunos();
  }, []);

  useEffect(() => {
    if (activeTab === "alertas") {
      setIsLoadingAlerts(true);
      fetchAllHistory()
        .then((data) => setAllHistory(data))
        .catch((err) => console.error("Erro ao buscar histórico:", err))
        .finally(() => setIsLoadingAlerts(false));
    }
  }, [activeTab]);

  const alunosFiltrados = alunos.filter(
    (aluno) =>
      aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
    setActiveTab("arquivos");
  };

  return (
    <div className="flex h-[100dvh] w-full bg-neutras-900 font-poppins overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onUploadClick={() => setIsModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onOpenMenu={() => setSidebarOpen(true)} />

        <div className="flex-1 flex flex-col p-4 md:p-8 lg:p-12 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-h3 md:text-h2 text-neutras-50 font-bold">Painel do Monitor</h1>
              <p className="text-neutras-400 text-body-small mt-2">
                Acompanhe seus alunos e gerencie o material da IA.
              </p>
            </div>

            {activeTab === "alunos" && (
              <div className="w-full md:w-auto">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Pesquisar alunos..." />
              </div>
            )}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
            className="flex-1 flex flex-col min-h-0"
          >
            <DashboardTabs />

            <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-neutras-700 scrollbar-track-transparent">
              <TabsContent value="alunos" className="m-0 focus-visible:ring-0">
                {isLoadingAlunos ? (
                  <div className="flex justify-center items-center h-32 text-neutras-400">Carregando alunos...</div>
                ) : (
                  <StudentsTable students={alunosFiltrados} searchTerm={searchTerm} />
                )}
              </TabsContent>

              <TabsContent value="arquivos" className="m-0 focus-visible:ring-0">
                <FileManager refreshKey={refreshKey} />
              </TabsContent>

              <TabsContent value="alertas" className="m-0 focus-visible:ring-0">
                {isLoadingAlerts ? (
                  <div className="flex justify-center items-center h-32 text-neutras-400">Carregando alertas...</div>
                ) : (
                  <AlertReport allHistoryData={allHistory} />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleUploadSuccess} />
    </div>
  );
}