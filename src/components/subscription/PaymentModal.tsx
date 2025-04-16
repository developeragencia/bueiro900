"use client";

import { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { QRCodeSVG } from 'qrcode.react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
  planDetails: {
    name: string;
    price: string;
  } | undefined;
}

export default function PaymentModal({
  isOpen,
  onClose,
  planId,
  planDetails,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Aqui você implementaria a integração com a API de pagamentos
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Pagamento processado com sucesso!");
      onClose();
    } catch (error) {
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${planDetails?.price}5204000053039865802BR5925BUEIRO DIGITAL TECNOLOGIA6009SAO PAULO62070503***63040B15`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Pagamento - {planDetails?.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-blue-600">
                R$ {planDetails?.price}
              </span>
              <span className="text-gray-500">/mês</span>
            </div>

            <Tabs
              defaultValue="credit-card"
              onValueChange={setPaymentMethod}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credit-card">Cartão de Crédito</TabsTrigger>
                <TabsTrigger value="pix">PIX</TabsTrigger>
              </TabsList>

              <TabsContent value="credit-card" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Número do Cartão</Label>
                  <Input
                    id="card-number"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Validade</Label>
                    <Input id="expiry" placeholder="MM/AA" maxLength={5} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" maxLength={3} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome no Cartão</Label>
                  <Input id="name" placeholder="Nome completo" />
                </div>
              </TabsContent>

              <TabsContent value="pix" className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <QRCodeSVG value={pixCode} size={256} />
                  <Button
                    onClick={() => navigator.clipboard.writeText(pixCode)}
                    variant="outline"
                    className="w-full"
                  >
                    Copiar Código PIX
                  </Button>
                  <p className="text-sm text-gray-500 text-center">
                    Escaneie o QR Code ou copie o código PIX para pagar
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {paymentMethod === "credit-card" && (
            <Button
              onClick={handlePayment}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Processando..." : "Pagar Agora"}
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
} 