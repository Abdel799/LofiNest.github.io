import styles from './Modal.module.css'
import { useState } from "react"

function EventModal ({ open, onClose, edit, editEvent, delete2 }) {

    if (!open) return null

    return (
        <>

            <div className={styles.overlay}>
  
                <div className={styles.form}>
                    <button className={styles.close} onClick={onClose}>✕</button>
                    <button className={styles.edit} onClick={edit}>Edit</button>
                    <button className={styles.delete} onClick={() => delete2(editEvent)}>Delete</button>
                </div>

            </div>

        </>
    )

}

export default EventModal