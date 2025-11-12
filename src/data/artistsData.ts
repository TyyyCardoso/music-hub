export interface ArtistSong {
  title: string;
  youtubeId: string;
  album?: string;
}

export interface ArtistTour {
  date: string;
  venue: string;
  city: string;
  country: string;
}

export interface ArtistAlbum {
  title: string;
  year: number;
  coverUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  topSongs: ArtistSong[];
  funFacts: string[];
  upcomingTours: ArtistTour[];
  albums: ArtistAlbum[];
  nextRelease?: {
    title: string;
    date: string;
    type: string;
  };
}

export const artistsData: Record<string, Artist> = {
  "taylor-swift": {
    id: "taylor-swift",
    name: "Taylor Swift",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    bio: "American singer-songwriter known for narrative songs about her personal life. Winner of 14 Grammy Awards.",
    topSongs: [
      { title: "Anti-Hero", youtubeId: "b1kbLwvqugk", album: "Midnights" },
      { title: "Cruel Summer", youtubeId: "ic8j13piAhQ", album: "Lover" },
      { title: "Blank Space", youtubeId: "e-ORhEE9VVg", album: "1989" },
      { title: "Shake It Off", youtubeId: "nfWlot6h_JM", album: "1989" },
      { title: "Love Story", youtubeId: "8xg3vE8Ie_E", album: "Fearless" },
    ],
    funFacts: [
      "First artist to win Album of the Year at the Grammys three times",
      "Named after James Taylor",
      "Writes or co-writes all of her own songs",
      "Has a cat named after Olivia Benson from Law & Order: SVU",
    ],
    upcomingTours: [
      { date: "2025-12-15", venue: "Estádio da Luz", city: "Lisboa", country: "Portugal" },
      { date: "2025-12-18", venue: "Wembley Stadium", city: "London", country: "UK" },
    ],
    albums: [
      { title: "Midnights", year: 2022 },
      { title: "Folklore", year: 2020 },
      { title: "Lover", year: 2019 },
      { title: "Reputation", year: 2017 },
      { title: "1989", year: 2014 },
    ],
    nextRelease: {
      title: "Reputation (Taylor's Version)",
      date: "2025-11-01",
      type: "Album",
    },
  },
  "kendrick-lamar": {
    id: "kendrick-lamar",
    name: "Kendrick Lamar",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    bio: "Pulitzer Prize-winning rapper, songwriter, and record producer. Known for his complex lyricism and social commentary.",
    topSongs: [
      { title: "HUMBLE.", youtubeId: "tvTRZJ-4EyI", album: "DAMN." },
      { title: "DNA.", youtubeId: "NLZRYQMLDW4", album: "DAMN." },
      { title: "Alright", youtubeId: "Z-48u_uWMHY", album: "To Pimp a Butterfly" },
      { title: "King Kunta", youtubeId: "hRK7PVJFbS8", album: "To Pimp a Butterfly" },
      { title: "Swimming Pools (Drank)", youtubeId: "B5YNiCfWC3A", album: "good kid, m.A.A.d city" },
    ],
    funFacts: [
      "First non-classical, non-jazz artist to win Pulitzer Prize for Music",
      "Won 17 Grammy Awards",
      "Real name is Kendrick Lamar Duckworth",
      "Grew up in Compton, California",
    ],
    upcomingTours: [],
    albums: [
      { title: "Mr. Morale & The Big Steppers", year: 2022 },
      { title: "DAMN.", year: 2017 },
      { title: "To Pimp a Butterfly", year: 2015 },
      { title: "good kid, m.A.A.d city", year: 2012 },
    ],
  },
  "billie-eilish": {
    id: "billie-eilish",
    name: "Billie Eilish",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    bio: "American singer-songwriter known for her ethereal vocals and dark pop aesthetic. Youngest artist to win all four main Grammy categories.",
    topSongs: [
      { title: "Bad Guy", youtubeId: "DyDfgMOUjCI", album: "When We All Fall Asleep, Where Do We Go?" },
      { title: "Happier Than Ever", youtubeId: "5GJWxDKyk3A", album: "Happier Than Ever" },
      { title: "Everything I Wanted", youtubeId: "qCTMq7xvdXU" },
      { title: "Lovely", youtubeId: "V1Pl8CzNzCw" },
      { title: "Ocean Eyes", youtubeId: "viimfQi_pUw" },
    ],
    funFacts: [
      "Youngest artist to win all four main Grammy categories in one night",
      "Wrote 'Ocean Eyes' when she was 13",
      "Works closely with her brother Finneas on all her music",
      "Has synesthesia and sees colors when listening to music",
    ],
    upcomingTours: [
      { date: "2025-11-20", venue: "Madison Square Garden", city: "New York", country: "USA" },
    ],
    albums: [
      { title: "Happier Than Ever", year: 2021 },
      { title: "When We All Fall Asleep, Where Do We Go?", year: 2019 },
    ],
  },
  "the-beatles": {
    id: "the-beatles",
    name: "The Beatles",
    imageUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800",
    bio: "Legendary British rock band that revolutionized popular music. Most influential band in history.",
    topSongs: [
      { title: "Hey Jude", youtubeId: "A_MjCqQoLLA", album: "Hey Jude" },
      { title: "Let It Be", youtubeId: "QDYfEBY9NM4", album: "Let It Be" },
      { title: "Yesterday", youtubeId: "NrgmdOz227I", album: "Help!" },
      { title: "Come Together", youtubeId: "45cYwDMibGo", album: "Abbey Road" },
      { title: "Here Comes the Sun", youtubeId: "KQetemT1sWc", album: "Abbey Road" },
    ],
    funFacts: [
      "Hold record for most #1 hits on Billboard Hot 100 (20 songs)",
      "Abbey Road zebra crossing is now a protected landmark",
      "Sold over 600 million records worldwide",
      "Disbanded in 1970 after 10 years together",
    ],
    upcomingTours: [],
    albums: [
      { title: "Abbey Road", year: 1969 },
      { title: "Let It Be", year: 1970 },
      { title: "Sgt. Pepper's Lonely Hearts Club Band", year: 1967 },
      { title: "Revolver", year: 1966 },
    ],
  },
  "adele": {
    id: "adele",
    name: "Adele",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    bio: "British singer-songwriter known for her powerful vocals and emotional ballads. Multiple Grammy winner.",
    topSongs: [
      { title: "Hello", youtubeId: "YQHsXMglC9A", album: "25" },
      { title: "Someone Like You", youtubeId: "hLQl3WQQoQ0", album: "21" },
      { title: "Rolling in the Deep", youtubeId: "rYEDA3JcQqw", album: "21" },
      { title: "Easy On Me", youtubeId: "U3ASj1L6_sY", album: "30" },
      { title: "Set Fire to the Rain", youtubeId: "FlsBObg-1BQ", album: "21" },
    ],
    funFacts: [
      "Album '21' was the best-selling album of the 2010s",
      "Won an Oscar for 'Skyfall' theme song",
      "Named her albums after the age she was when writing them",
      "First artist to have three albums in Billboard 200 top 10 simultaneously",
    ],
    upcomingTours: [],
    albums: [
      { title: "30", year: 2021 },
      { title: "25", year: 2015 },
      { title: "21", year: 2011 },
      { title: "19", year: 2008 },
    ],
  },
};
