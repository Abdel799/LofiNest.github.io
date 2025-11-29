import styles from './ModalPolo.module.css'
import { useState } from "react"
import { useEffect } from "react"

function ModalPolo ({open, onClose, add}) {

    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    
    if (!open) return null

    const handleSubmit = () => {
        add({hour, minute, second})
        console.log("Selected time:", hour, minute, second);
        onClose()
    }
    
    return (
        <>

            <div className={styles.overlay}>
              
                <div className={styles.form}>
                    <button className={styles.close} onClick={onClose}>✕</button>
                    <h1>Set Time</h1>

                    <div className={styles.timeInputs}>

                        <div>
                            <label htmlFor="hour">
                                Hour:
                            </label>

                            <select value={hour} onChange={e => setHour(Number(e.target.value))} id="hour" name="hour" defaultValue="0">
                                {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="minute">
                                Minute:
                            </label>

                            <select value={minute} onChange={e => setMinute(Number(e.target.value))} id="minute" name="minute" defaultValue="0">
                                {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="second">
                            Second:
                            </label>

                            <select value={second} onChange={e => setSecond(Number(e.target.value))} id="second" name="second" defaultValue="0">
                                {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <button type="submit" onClick={handleSubmit}>Save</button>
                </div>
            
            </div>

        </>
    )
}

export default ModalPolo