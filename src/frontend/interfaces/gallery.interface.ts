export type ImageItem = {
  id: number;
  text: string;
  location: string;
  date: string;
  img: string;
};

export interface FilterBarProps {
  galleryView: string;
  galleryViewSetter(type: string): void;
}

export const srces = [
  {
    date: "2026-04-10",
    imgs: [
      {
        id: 0,
        text: "Zsófi fotó",
        location: "Turkey",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=20",
      },
      {
        id: 1,
        text: "Dóri képe",
        location: "Germany",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        id: 2,
        text: "Erik városi fotó",
        location: "France",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        resolution: "1920x1080",
        img: "https://picsum.photos/300/400?random=5",
      },
      {
        id: 4,
        text: "KisJakab képe",
        location: "Hungary",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=1",
      },
      {
        id: 3,
        text: "Anna portré",
        location: "Austria",
        lastModified: "2026-04-26",
        date: "2026-04-10",
        img: "https://picsum.photos/500/400?random=2",
      },
      {
        id: 5,
        text: "Juli fotó",
        location: "Spain",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        id: 6,
        text: "Kata képe",
        location: "Portugal",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=11",
      },
    ],
  },
  {
    date: "2026-04-06",
    imgs: [
      {
        id: 7,
        text: "KisJakab képe",
        location: "Hungary",
        date: "2026-04-06",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=1",
      },
      {
        id: 8,
        text: "Anna portré",
        location: "Austria",
        date: "2026-04-06",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/500/400?random=2",
        resolution: "1920x1080",
      },
      {
        id: 9,
        text: "Juli fotó",
        location: "Spain",
        date: "2026-04-06",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        id: 10,
        text: "Kata képe",
        location: "Portugal",
        date: "2026-04-06",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=11",
      },
    ],
  },
  {
    date: "2026-04-01",
    imgs: [
      {
        id: 11,
        text: "Juli fotó",
        location: "Spain",
        lastModified: "2026-04-26",
        date: "2026-04-01",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        id: 12,
        text: "Kata képe",
        location: "Portugal",
        lastModified: "2026-04-26",
        date: "2026-04-01",
        img: "https://picsum.photos/300/400?random=11",
        resolution: "1920x1080",
      },
    ],
  },
  {
    date: "2026-03-22",
    imgs: [
      {
        id: 13,
        text: "Nóri fotó",
        location: "Sweden",
        lastModified: "2026-04-26",
        date: "2026-03-22",
        img: "https://picsum.photos/500/600?random=14",
      },
      {
        id: 14,
        text: "Olivér képe",
        location: "Norway",
        lastModified: "2026-04-26",
        date: "2026-03-22",
        img: "https://picsum.photos/500/400?random=15",
      },
    ],
  },
  {
    date: "2026-03-01",
    imgs: [
      {
        id: 15,
        text: "Hédi képe",
        lastModified: "2026-04-26",
        location: "Poland",
        date: "2026-03-01",
        img: "https://picsum.photos/700/400?random=8",
      },
      {
        id: 16,
        text: "István portré",
        location: "Czech Republic",
        date: "2026-03-01",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=9",
      },
    ],
  },
  {
    date: "2026-02-18",
    imgs: [
      {
        id: 17,
        text: "Fanni portré",
        location: "Italy",
        date: "2026-02-18",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=6",
      },
      {
        id: 18,
        text: "Gábor túra",
        location: "Slovakia",
        date: "2026-02-18",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/500/400?random=7",
      },
    ],
  },
  {
    date: "2026-02-14",
    imgs: [
      {
        id: 19,
        text: "Sára képe",
        location: "Switzerland",
        date: "2026-02-14",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=18",
      },
      {
        id: 20,
        text: "Tamás portré",
        location: "Greece",
        date: "2026-02-14",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=19",
      },
    ],
  },
  {
    date: "2026-02-05",
    imgs: [
      {
        id: 21,
        text: "Laci portré",
        location: "Netherlands",
        date: "2026-02-05",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=12",
      },
      {
        id: 22,
        text: "Márk utazás",
        location: "Belgium",
        lastModified: "2026-04-26",
        date: "2026-02-05",
        img: "https://picsum.photos/400/400?random=13",
      },
    ],
  },
  {
    date: "2026-01-28",
    imgs: [
      {
        id: 23,
        text: "Petra portré",
        location: "Denmark",
        date: "2026-01-28",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/600/400?random=16",
        resolution: "1920x1080",
      },
      {
        id: 24,
        text: "Ricsi fotó",
        location: "Finland",
        date: "2026-01-28",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/500/400?random=17",
      },
      {
        id: 25,
        text: "Dóri képe",
        location: "Germany",
        date: "2026-01-15",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        id: 26,
        text: "Erik városi fotó",
        location: "France",
        date: "2026-01-15",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=5",
      },
    ],
  },
  {
    date: "2026-01-15",
    imgs: [
      {
        id: 27,
        text: "Dóri képe",
        location: "Germany",
        date: "2026-01-15",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        id: 28,
        text: "Erik városi fotó",
        location: "France",
        lastModified: "2026-04-26",
        date: "2026-01-15",
        img: "https://picsum.photos/300/400?random=5",
      },
    ],
  },
  {
    date: "2025-08-22",
    imgs: [
      {
        id: 29,
        text: "Balázs nyaralás",
        location: "Croatia",
        date: "2025-08-22",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/500/400?random=3",
      },
    ],
  },
];