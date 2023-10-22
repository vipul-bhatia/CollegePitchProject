// styles
import styles from './Home.module.css'
export default function TransactionList({ transactions, onSelect }) {
    return (
      <ul className={styles.transactions} >
        {transactions.map((transaction) => (
          <li key={transaction.id} onClick={() => onSelect(transaction)}>
            <p className={styles.name}>{transaction.teamName}</p>
            <p className={styles.amount}>{transaction.teamid}</p>
            <button onClick={() => onSelect(transaction)}>Select</button>
          </li>
        ))}
      </ul>
    );
  }