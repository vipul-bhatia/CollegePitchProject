import { useState, useEffect, useRef, useCallback } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

export default function TransactionForm({ uid, email, selectedTeam , isScored, setIsScored}) {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [score3, setScore3] = useState(0);
  const [score4, setScore4] = useState(0);
  const [score5, setScore5] = useState(0);
  const [score6, setScore6] = useState(0);
  const [score7, setScore7] = useState(0);
  const [comment, setComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);



  const { addDocument, updateDocument, getDocumentByCriteria, response } = useFirestore('scores');

  const previousTeam = useRef();  // Reference to track the previous team

 const disableScroll = (e) => {
  e.target.addEventListener('mousewheel', preventScroll);
};

const enableScroll = (e) => {
  e.target.removeEventListener('mousewheel', preventScroll);
};

const preventScroll = (e) => {
  e.preventDefault();
};

  useEffect(() => {
    console.log("Selected team changed to: ", selectedTeam?.teamName);
    if (!selectedTeam || (previousTeam.current && previousTeam.current.teamName === selectedTeam.teamName)) {
      
    return;
}


    const fetchExistingScore = async () => {
      const existingScore = await getDocumentByCriteria({
        uid,
        teamName: selectedTeam.teamName,
      });

      if (existingScore) {
        setIsUpdating(true);
        setScore1(existingScore.score1);
        setScore2(existingScore.score2);
        setScore3(existingScore.score3);
        setScore4(existingScore.score4);
        setScore5(existingScore.score5);
        setScore6(existingScore.score6);
     //   setScore7(existingScore.score7);
        setComment(existingScore.comment);
      } else {
        setIsUpdating(false);
        setScore1('');
        setScore2('');
        setScore3('');
        setScore4('');
        setScore5('');
        setScore6('');
      //  setScore7('');
        setComment('');
      }
    };

    fetchExistingScore();
    previousTeam.current = selectedTeam;  // Update the previous team reference

  }, [selectedTeam, uid, getDocumentByCriteria]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
  
    if (isUpdating) {
      const existingScore = await getDocumentByCriteria({
        uid,
        teamName: selectedTeam.teamName,
      });
      if (existingScore && existingScore.id) {
        await updateDocument(existingScore.id, {
          score1, score2, score3, score4, score5, score6, comment
        });
      }
    } else {
      await addDocument({
        uid,
        email,
        teamName: selectedTeam.teamName,
        teamid: selectedTeam.teamid,
        teamEmailId: selectedTeam.email_participant,
        score1,
        score2,
        score3,
        score4,
        score5,
        score6,
        comment,
      });
 
    }
  
    // After submitting, refetch data
    const updatedScore = await getDocumentByCriteria({
      uid,
      teamName: selectedTeam.teamName,
    });
  
    // Update the form fields with refetched data
    if (updatedScore) {
      setScore1(updatedScore.score1);
      setScore2(updatedScore.score2);
      setScore3(updatedScore.score3);
      setScore4(updatedScore.score4);
      setScore5(updatedScore.score5);
      setScore6(updatedScore.score6);
      setComment(updatedScore.comment);
    }
  
    setIsScored(true);
    setIsUpdating(false);
  };
  

  useEffect(() => {
    if (response.success) {
      setScore1('');
      setScore2('');
      setScore3('');
      setScore4('');
      setScore5('');
      setScore6('');
      // setScore7('');
      setComment('');
    }
  }, [response.success]);

  return (
    <>
      <h3>{isUpdating ? 'Update' : 'Add'} scores for {selectedTeam?.teamName || 'team name'}</h3>
      {isScored && response.success ? (
      <div>
        <p>You have scored {selectedTeam?.teamName}. Please select another team.</p>
        {/* Possibly add a button or link to go back and select another team */}
      </div>
    ) : selectedTeam ? (
      <form onSubmit={handleSubmit}>
        <label>
          <span>Viability and potential for success of the business idea.(0-10)</span>
          <input 
            type="number"
            required
            onChange={(e) => setScore1(e.target.value)}
             onFocus={disableScroll} 
  onBlur={enableScroll}   
  min='0'
            max="10"
            value={score1} 
          />
        </label>
        <label>
          <span>Market analysis and understanding of the target audience.(0-10)</span>
          <input
            type="number"
            required
            onChange={(e) => setScore2(e.target.value)}
            onFocus={disableScroll} 
  onBlur={enableScroll}  
  min='0' 
            max="10"
            value={score2} 
          />
        </label>
        <label>
          <span>Quality and feasibility of the marketing and sales strategy.(0-10)</span>
          <input
            type="number"
            required
            onChange={(e) => setScore3(e.target.value)}
            onFocus={disableScroll} 
  onBlur={enableScroll} 
  min='0'  
            max="10"
            value={score3}
          />
        </label>
        <label>
          <span>Financial projections and profitability of the business.(0-10)</span>
          <input
            type="number"
            required
            onChange={(e) => setScore4(e.target.value)}
            onFocus={disableScroll} 
  onBlur={enableScroll}   
  min='0'
            max="10"
            value={score4}
          />
        </label>
        <label>
          <span>Level of innovation and uniqueness of the business idea.(0-10)</span>
          <input
            type="number"
            required
            onChange={(e) => setScore5(e.target.value)}
            onFocus={disableScroll} 
  onBlur={enableScroll}   
  min='0'
            max="10"
            value={score5}
          />
        </label>
        <label>
          <span>Presentation quality and effectiveness of the pitch.(0-10)</span>
          <input
            type="number"
            required
            onChange={(e) => setScore6(e.target.value)}
            onFocus={disableScroll} 
  onBlur={enableScroll}   
  min='0'
            max="10"
            value={score6}
          />
        </label>
        {/* <label>
          <span>Total(Out of 60)</span>
          <input
            type="number"
            readOnly
            required
            value={score7}
          />
        </label> */}
        <label>
          <span>Comments</span>
          <textarea
            type="text"
            rows="10"
            cols="30"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
        </label>
        
        <button disabled={response.isPending}>
          {response.isPending ? `${isUpdating ? 'Updating' : 'Adding'} Scores...` : `${isUpdating ? 'Update' : 'Add'} Scores`}
        </button>
      </form>
    ):
    (
      <p>Please select a team to add scores.</p>
    )
    }
    </>
  );
}
