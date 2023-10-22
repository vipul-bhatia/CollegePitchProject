import { useReducer,useEffect,useState,} from "react";
import { projectFirestore ,timestamp} from "../firebase/config";

let initialState = {
    document: null,
isPending: false,
error: null,
success: null
}

const firestoreReducer = (state,action) => {
    switch(action.type){
        case 'IS_PENDING':
            return {...state, isPending:true,document:null, success  :false, error:null}
        case 'ADDED_DOCUMENT':
            return {isPending:false, document:action.payload, success  :true, error:null}
        case 'ERROR':
            return {isPending:false, document:null, success  :false, error:action.payload}
        case 'UPDATING_DOCUMENT':
            return { ...state, isPending: true, success: false, error: null }
        case 'UPDATED_DOCUMENT':
            return { ...state, isPending: false, success: true, error: null }
        default: 
            return state
    }
}

export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState);
    const [isCancelled, setIsCancelled] = useState(false);

    const ref = projectFirestore.collection(collection);

    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    }

    const getDocumentByCriteria = async (criteria) => {
        try {
            let query = ref;
            for (let key in criteria) {
                query = query.where(key, '==', criteria[key]);
            }
            
            const snapshot = await query.get();
            if (!snapshot.empty) {
                // Return the first matched document data and its ID
                const doc = snapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (err) {
            console.error("Error fetching document:", err);
            return null;
        }
    };
    

    const addDocument = async (doc) => {
        dispatch({ type: 'IS_PENDING' });

        try {
            const createdAt = timestamp.fromDate(new Date());
            const addedDocument = await ref.add({ ...doc, createdAt });
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument });
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        }
    }

    const updateDocument = async (id, updatedDoc) => {
        dispatch({ type: 'UPDATING_DOCUMENT' });

        try {
            await ref.doc(id).update(updatedDoc);
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT' });
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        }
    }



    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { response, addDocument, updateDocument, getDocumentByCriteria };
}
