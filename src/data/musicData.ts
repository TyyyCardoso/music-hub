export type MusicInfo = {
  code: string;
  country: string;
  artists: string[];
  genres: string[];
  description: string;
  funFact?: string;
};

export interface CountryMusic {
  country: string;
  code: string;
  artists: string[];
  genres: string[];
  description: string;
  funFact?: string;
}

export const musicDataByCountry: Record<string, CountryMusic> = {
  "840": {
    country: "United States",
    code: "840",
    artists: ["Taylor Swift", "Kendrick Lamar", "Billie Eilish", "Drake"],
    genres: ["Pop", "Hip Hop", "Rock", "Country", "Jazz"],
    description: "Birthplace of jazz, blues, and hip hop. Home to diverse musical traditions from country to rock.",
    funFact: "The USA has produced more Grammy winners than any other country in history.",
  },
  "826": {
    country: "United Kingdom",
    code: "826",
    artists: ["The Beatles", "Adele", "Ed Sheeran", "Coldplay"],
    genres: ["Rock", "Pop", "Electronic", "Punk"],
    description: "British Invasion pioneers. Leading force in rock, punk, and electronic music.",
    funFact: "The Beatles hold the record for most #1 hits on the Billboard Hot 100 with 20 songs.",
  },
  "076": {
    country: "Brazil",
    code: "076",
    artists: ["Anitta", "Caetano Veloso", "Gilberto Gil", "Seu Jorge"],
    genres: ["Bossa Nova", "Samba", "Funk Carioca", "MPB"],
    description: "Rich rhythmic traditions. Bossa nova and samba influence worldwide music.",
    funFact: "Bossa nova was created in Rio de Janeiro and became an international phenomenon in the 1960s.",
  },
  "410": {
    country: "South Korea",
    code: "410",
    artists: ["BTS", "BLACKPINK", "IU", "PSY"],
    genres: ["K-Pop", "R&B", "Hip Hop", "Ballad"],
    description: "K-pop global phenomenon. Cutting-edge production and synchronized performances.",
    funFact: "BTS became the first K-pop group to top the Billboard 200 chart in 2018.",
  },
  "566": {
    country: "Nigeria",
    code: "566",
    artists: ["Burna Boy", "Wizkid", "Fela Kuti", "Tiwa Savage"],
    genres: ["Afrobeats", "Afrobeat", "Highlife", "Juju"],
    description: "Afrobeats taking the world by storm. Rich percussion and polyrhythmic traditions.",
    funFact: "Fela Kuti invented Afrobeat and recorded over 70 albums during his lifetime.",
  },
  "250": {
    country: "France",
    code: "250",
    artists: ["Daft Punk", "Édith Piaf", "David Guetta", "Christine and the Queens"],
    genres: ["Electronic", "Chanson", "House", "Pop"],
    description: "Electronic music pioneers. Rich chanson tradition and modern EDM innovation.",
    funFact: "France is the world's 2nd largest music market after the USA.",
  },
  "392": {
    country: "Japan",
    code: "392",
    artists: ["Hikaru Utada", "Babymetal", "Ryuichi Sakamoto", "Perfume"],
    genres: ["J-Pop", "City Pop", "Enka", "Visual Kei"],
    description: "Unique fusion of traditional and modern sounds. City pop and J-pop global influence.",
    funFact: "Japan has more than 100 music festivals annually, including the famous Fuji Rock Festival.",
  },
  "388": {
    country: "Jamaica",
    code: "388",
    artists: ["Bob Marley", "Sean Paul", "Shaggy", "Chronixx"],
    genres: ["Reggae", "Dancehall", "Ska", "Dub"],
    description: "Birthplace of reggae and dancehall. Bob Marley brought Jamaican music to the world stage.",
    funFact: "Reggae music was added to UNESCO's list of intangible cultural heritage in 2018.",
  },
  "032": {
    country: "Argentina",
    code: "032",
    artists: ["Astor Piazzolla", "Mercedes Sosa", "Gustavo Cerati", "Bizarrap"],
    genres: ["Tango", "Folk", "Rock", "Trap"],
    description: "Tango capital of the world. Rich folk traditions and modern urban sounds.",
    funFact: "Argentina has won the Latin Grammy for Album of the Year multiple times.",
  },
  "276": {
    country: "Germany",
    code: "276",
    artists: ["Kraftwerk", "Rammstein", "Paul van Dyk", "Nena"],
    genres: ["Electronic", "Techno", "Industrial", "Krautrock"],
    description: "Electronic and techno music pioneers. Berlin is the techno capital of the world.",
    funFact: "Kraftwerk influenced countless electronic and hip hop artists worldwide.",
  },
  "356": {
    country: "India",
    code: "356",
    artists: ["A.R. Rahman", "Lata Mangeshkar", "Asha Bhosle", "Nucleya"],
    genres: ["Bollywood", "Classical", "Bhangra", "Electronic"],
    description: "Bollywood produces more film soundtracks than any country. Rich classical traditions.",
    funFact: "India releases over 1,500 film soundtracks per year across multiple languages.",
  },
  "484": {
    country: "Mexico",
    code: "484",
    artists: ["Luis Miguel", "Natalia Lafourcade", "Bad Bunny", "Café Tacvba"],
    genres: ["Mariachi", "Ranchera", "Regional Mexicano", "Rock"],
    description: "Mariachi and ranchera traditions. Vibrant regional and modern Latin sounds.",
    funFact: "Mariachi music was recognized by UNESCO as an Intangible Cultural Heritage.",
  },
  "724": {
    country: "Spain",
    code: "724",
    artists: ["Rosalía", "Enrique Iglesias", "Paco de Lucía", "C. Tangana"],
    genres: ["Flamenco", "Pop", "Reggaeton", "Rock"],
    description: "Flamenco guitar virtuosity. Modern fusion of traditional and urban sounds.",
    funFact: "Flamenco combines singing, guitar, dance, and handclaps in a unique art form.",
  },
  "124": {
    country: "Canada",
    code: "124",
    artists: ["Drake", "The Weeknd", "Céline Dion", "Justin Bieber"],
    genres: ["Pop", "R&B", "Hip Hop", "Indie"],
    description: "Massive pop and R&B exports. Toronto's sound influences global hip hop.",
    funFact: "Canada requires 35% of music on radio to be Canadian content by law.",
  },
  "036": {
    country: "Australia",
    code: "036",
    artists: ["AC/DC", "Kylie Minogue", "Tame Impala", "Sia"],
    genres: ["Rock", "Pop", "Indie", "Electronic"],
    description: "Rock legends and modern indie innovators. Diverse music scene down under.",
    funFact: "AC/DC's 'Back in Black' is one of the best-selling albums of all time.",
  },
  "752": {
    country: "Sweden",
    code: "752",
    artists: ["ABBA", "Avicii", "Robyn", "Swedish House Mafia"],
    genres: ["Pop", "EDM", "House", "Indie"],
    description: "Pop songwriting powerhouse. Stockholm produces hits for artists worldwide.",
    funFact: "Sweden is the 3rd largest music exporter in the world despite its small population.",
  },
  "192": {
    country: "Cuba",
    code: "192",
    artists: ["Buena Vista Social Club", "Celia Cruz", "Compay Segundo", "Omara Portuondo"],
    genres: ["Son", "Salsa", "Rumba", "Timba"],
    description: "Son cubano and salsa roots. Rich percussion and dance traditions.",
    funFact: "Cuban music heavily influenced the development of jazz in New Orleans.",
  },
  "818": {
    country: "Egypt",
    code: "818",
    artists: ["Umm Kulthum", "Amr Diab", "Mohamed Mounir", "Cairokee"],
    genres: ["Arabic Pop", "Shaabi", "Classical Arabic", "Rock"],
    description: "Arabic music tradition center. Umm Kulthum remains the most influential Arab singer.",
    funFact: "Umm Kulthum's funeral in 1975 attracted over 4 million mourners in Cairo.",
  },
  "710": {
    country: "South Africa",
    code: "710",
    artists: ["Miriam Makeba", "Hugh Masekela", "Black Coffee", "Die Antwoord"],
    genres: ["Kwaito", "House", "Jazz", "Hip Hop"],
    description: "Kwaito and Afro-house innovators. Rich jazz and choral traditions.",
    funFact: "South African house music, particularly from Black Coffee, dominates global club scenes.",
  },
  "792": {
    country: "Turkey",
    code: "792",
    artists: ["Tarkan", "Sezen Aksu", "Barış Manço", "Şebnem Ferah"],
    genres: ["Arabesque", "Pop", "Rock", "Traditional"],
    description: "Bridge between Eastern and Western musical traditions. Unique blend of sounds.",
    funFact: "Turkey has a unique 9-beat rhythm cycle called 'aksak' used in traditional music.",
  },
};
