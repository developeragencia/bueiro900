"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CampaignEditPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // Aqui você pode carregar os dados da campanha
    console.log("Campaign ID:", params.id);
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode salvar as alterações
    router.push("/dashboard/campaigns");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Campanha</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <Input
            value={campaign.name}
            onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
            placeholder="Nome da campanha"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <Input
            value={campaign.description}
            onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
            placeholder="Descrição da campanha"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Salvar</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/campaigns")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
} 