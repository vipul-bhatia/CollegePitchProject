// styles
import styles from './Home.module.css'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import {useAuthContext} from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import { useState } from 'react'

export default function Home() {
  const { user } = useAuthContext();
  const { documents } = useCollection('registrations');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScored, setIsScored] = useState(false);  // Added state for isScored

  // Filter the teams based on the search term
  const filteredTeams = searchTerm
    ? documents.filter((team) =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : documents;

  // Here is the handleSelectTeam function
  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setIsScored(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Search for a team..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <TransactionList transactions={filteredTeams} onSelect={handleSelectTeam} />
      </div>
      <div className={styles.sidebar}>
        <TransactionForm 
          uid={user.uid} 
          email={user.email} 
          selectedTeam={selectedTeam} 
          isScored={isScored} 
          setIsScored={setIsScored} 
        />
      </div>
    </div>
  );
}


