interface Stations {
  id: number;
  ville: string;
  adresse: string;
  e10_prix: string;
  longitude: number;
  geom: {
    lat: number;
    lon: number;
  };
}

interface PrixCarburant {
    total_count: number;
    results: Array<Stations>;
}
  
export default PrixCarburant;
  