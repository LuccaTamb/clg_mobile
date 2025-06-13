// mockData.ts
export const mockAppUsage = [
  { id: '1', name: 'Instagram', usage: 120 },
  { id: '2', name: 'Facebook', usage: 90 },
  { id: '3', name: 'asd', usage: 150 },
  { id: '4', name: 'WhatsApp', usage: 200 },
  { id: '5', name: 'YouTube', usage: 180 },
  { id: '6', name: 'Twitter', usage: 75 },
  { id: '7', name: 'LinkedIn', usage: 45 },
  { id: '8', name: 'Netflix', usage: 240 },
  { id: '9', name: 'Spotify', usage: 150 },
  { id: '10', name: 'Discord', usage: 110 },
  { id: '11', name: 'Telegram', usage: 95 },
];

export const mockLearningVideos = [
  { id: 1, title: 'Gerenciamento Financeiro', url: 'https://www.youtube.com/watch?v=abc123' },
  { id: 2, title: 'Economia Doméstica', url: 'https://www.youtube.com/watch?v=def456' },
];

export const mockChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    data: [300, 450, 200, 600, 500, 400],
    color: (opacity = 1) => `rgba(58, 134, 255, ${opacity})`,
  }]
};
