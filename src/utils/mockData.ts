export const mockAppUsage = [
  { id: '1', name: 'Instagram', usage: 120 },
  { id: '2', name: 'Facebook', usage: 90 },
  { id: '3', name: 'TikTok', usage: 150 },
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