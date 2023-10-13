interface Stations {
  id: number;
  ville: string;
  longitude: number
}

interface PrixCarburant {
    total_count: number;
    results: Array<Stations>;
}
  
export default PrixCarburant;
  