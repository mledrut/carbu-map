interface Props {
  dateStr: string; // La date au format '2023-10-17 09:02:14'
}

const DateFormatter: React.FC<Props> = ({ dateStr }) => {
  const date = new Date(dateStr);

  // Définir les noms des jours de la semaine et des mois en français
//   const joursSemaine: string[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const mois: string[] = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  // Récupérer les éléments de la date
//   const jourSemaine: string = joursSemaine[date.getDay()];
  const jour: number = date.getDate();
  const moisTexte: string = mois[date.getMonth()];
  const annee: number = date.getFullYear();
  const heure: number = date.getHours();

  // Formater la date
  const formattedDate: string = `${jour} ${moisTexte} ${annee} ${heure}h`;

  return formattedDate;
};

export default DateFormatter;
