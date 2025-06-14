// mockData.ts
export const mockAppUsage = [
  { id: '1', name: 'Bet dá Sorte', usage: 120 },
  { id: '2', name: 'Betano', usage: 90 },
  { id: '3', name: 'VBet', usage: 150 },
  { id: '4', name: 'Betnacional', usage: 200 },
  { id: '5', name: 'bet365', usage: 180 },
  { id: '6', name: 'Stake', usage: 75 },
  { id: '7', name: 'Superbet', usage: 45 },
  { id: '8', name: 'Novibet', usage: 240 },
  { id: '9', name: 'KTO', usage: 150 },
  { id: '10', name: 'Estrela Bet', usage: 110 },
  { id: '11', name: 'F12 Bet', usage: 95 },
];

export const mockLearningVideos = [
  { id: 1, title: 'Começar no Mercado Financeiro', url: 'https://youtu.be/8HeMXk3JbMk?si=Zf_Mf8F1GEVeXZ7Y' },
  { id: 2, title: 'Renda Fixa Atualmente', url: 'https://youtu.be/Wj4814pYAYg?si=w2iGcItoRG2aLLqr' },
  { id: 3, title: 'Investimento para PJ', url: 'https://youtu.be/KYDxlcDi2cU?si=55YvtVSqtggMq-x4' },
  { id: 4, title: 'Onde Investir em Maio 2025', url: 'https://youtu.be/xHdqKabvlAQ?si=cjujzU43X4e3b7yj' },
  { id: 5, title: 'Otimismo com o Brasil', url: 'https://youtu.be/bo_TXMt-Jrk?si=J8f_ek5daRPmkSv1' },
  { id: 6, title: 'Investir em Crédito Privado', url: 'https://youtu.be/wYXig5UCwYU?si=tpAs06ayxmdjo8-c' },
  { id: 7, title: 'Fundos Imobiliarios', url: 'https://youtu.be/HJ5g9MeKQ50?si=MLUMUtkrzDm5JO9S' },
  { id: 8, title: 'Investir no Exterior', url: 'https://youtu.be/Ye3bU8ugT8c?si=D-SjibPqOtMFhwWO' },
  { id: 9, title: 'Investir com Juros Altos', url: 'https://youtu.be/mUVxUZspCaI?si=LGa33ovi_K4pdBnn' }
];

export const mockChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    data: [300, 450, 200, 600, 500, 400],
    color: (opacity = 1) => `rgba(58, 134, 255, ${opacity})`,
  }]
};
