import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): string {
  const places = placesRestantes(e);

  if (places === 0) return 'Complet';
  if (places <= 3) return 'Presque complet';
  return 'Ouvert';
}

function BadgeEtat({ statut }: { statut: string }) {
  let couleur = '#dcfce7';

  if (statut === 'Complet') couleur = '#fecaca';
  else if (statut === 'Presque complet') couleur = '#fed7aa';

  return (
    <View style={[styles.badge, { backgroundColor: couleur }]}>
      <Text>{statut}</Text>
    </View>
  );
}

function CarteEvenement({ evenement }: { evenement: Evenement }) {
  return (
    <View style={styles.card}>
      <Text style={styles.titre}>{evenement.titre}</Text>
      <Text style={styles.categorie}>{evenement.categorie}</Text>
      <Text style={styles.places}>
        {placesRestantes(evenement)} places libres
      </Text>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

function BlocStatistique({
  label,
  nombre,
}: {
  label: string;
  nombre: number;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNombre}>{nombre}</Text>
      <Text>{label}</Text>
    </View>
  );
}

const totalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  e => placesRestantes(e) === 0
).length;

const evenementsAvecPlaces = evenements.filter(
  e => placesRestantes(e) > 0
).length;

const totalPlaces = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);

const ateliersDisponibles = evenements.filter(
  e => e.categorie === 'Atelier' && placesRestantes(e) > 0
);

// Modifier cette constante pour tester les deux modes.
const mode: 'tous' | 'ateliers' = 'tous';

export default function App() {
  const evenementsAffiches =
    mode === 'tous' ? evenements : ateliersDisponibles;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>CampusAgenda</Text>
        <Text style={styles.subtitle}>Événements du campus</Text>
      </View>

      <View style={styles.statsContainer}>
        <BlocStatistique label="Événements" nombre={totalEvenements} />
        <BlocStatistique label="Événements complets" nombre={evenementsComplets} />
        <BlocStatistique label="Avec des places" nombre={evenementsAvecPlaces} />
        <BlocStatistique label="Places restantes" nombre={totalPlaces} />
      </View>

      <Text style={styles.sectionTitle}>
        {mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles'}
      </Text>

      <FlatList
        data={evenementsAffiches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun événement disponible.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 22,
    borderRadius: 16,
    marginBottom: 20,
  },
  appTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#dbeafe',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  statNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  titre: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  categorie: {
    color: '#6b7280',
    marginTop: 5,
  },
  places: {
    color: '#2563eb',
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  badge: {
    alignSelf: 'flex-start',
    padding: 7,
    borderRadius: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#6b7280',
  },
});