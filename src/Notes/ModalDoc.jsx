import styles from './ModalDoc.module.css'
import { useState } from "react"
import { useEffect } from "react"

function Modal ({ open, onClose, add, editDoc, updateDoc, reset }) {

    if (!open) return null

    const [title, setTitle] = useState("")

    useEffect( () => {
    
        if (editDoc){
            setTitle(editDoc.Name)
        }
        else {
            setTitle("")
        }
    
    }, [editDoc, open])

    const handleSubmit = () => {
        
        if (editDoc) {
            const updatedDoc = {
                ...editDoc,
                Name: title
            };
            updateDoc(updatedDoc);
            reset(null)
        }

        else{

            const newDoc = {
                id: Date.now(),
                Name: title
            };
    
            console.log("New Doc:", newDoc); 
            add(newDoc)

        }
        
      
        onClose() 
        
    }
    
    return (
        <>
           <div className={styles.overlay}>
  
                <div className={styles.form}>
                    <button className={styles.close} onClick={onClose}>✕</button>
                    <h1>Add Document</h1>
                    <label for="Title">Document Name</label>
                    <input type="text" id="Title" name="Title" value={title} onChange={(newTitle) => setTitle(newTitle.target.value)} />
                    <button type="submit" onClick={handleSubmit}>Save</button>
                </div>

            </div>
        </>
    )

}

export default Modal