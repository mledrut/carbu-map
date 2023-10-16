interface Stations {
  id: number;
  ville: string;
  adresse: string;
  gazole_prix: string;
  e10_prix: string;
  sp98_prix: string;
  sp95_prix: string;
  gplc_prix: string;
  gazole_maj: string;
  e10_maj: string;
  sp98_maj: string;
  sp95_maj: string;
  gplc_maj: string;
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
  