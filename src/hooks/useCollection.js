import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';

export const useCollection = (collection, query = null) => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ref = projectFirestore.collection(collection);

        

        const unsubscribe = ref.onSnapshot((snapshot) => {
            let results = [];
            snapshot.docs.forEach((doc) => {
                results.push({ ...doc.data(), id: doc.id })
            });

            setDocuments(results);
            setError(null);
        }, (error) => {
            console.log(error.message);
            setError('Could not fetch the data');
        })

        return () => unsubscribe();
    }, [collection, query])

    return { documents, error }
}
