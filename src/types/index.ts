export type VideoItem = {
  id: number;
  title: string;
  url: string;
};

export type AppUsage = {
  id: string;
  name: string;
  usage: number;
  blockedUntil?: number;
  remaining?: number;
};

export type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
  }[];
};

