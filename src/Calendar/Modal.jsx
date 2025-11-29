import styles from './Modal.module.css'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useState } from "react"
import { useEffect } from "react"

function Modal ({ open, onClose, add, selectedDate, editEvent, updateEvent, reset }) {

    if (!open) return null

    const [title, setTitle] = useState("")
    const [time, setTime] = useState(dayjs("2022-04-17T15:30"));

    useEffect( () => {

        if (editEvent){
            setTitle(editEvent.Name)
            setTime(dayjs(editEvent.Time, "h:mm A"));
        }
        else {
            setTitle("")
            setTime(dayjs("2022-04-17T15:30"));
        }

    }, [editEvent, open])

    const handleSubmit = () => {
        
        if (editEvent) {
            const updatedEvent = {
                ...editEvent,
                Name: title,
                Time: time.format("h:mm A")
            };
            updateEvent(updatedEvent);
            reset(null)
        }

        else {

            const newEvent = {
                id: Date.now(),
                Name: title,
                Time: time.format("h:mm A"),
                Date: selectedDate.toISOString().split("T")[0]
            };
            console.log("New Event:", newEvent); 
            add(newEvent)

        }
        
        
        onClose() 
        
    }
    
    return (
        <>
           <div className={styles.overlay}>
  
                <div className={styles.form}>
                    <button className={styles.close} onClick={onClose}>✕</button>
                    <h1>Add Event</h1>
                    <label for="Title">Event Name</label>
                    <input type="text" id="Title" name="Title" value={title} onChange={(newTitle) => setTitle(newTitle.target.value)} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker value={time} onChange={(newValue) => setTime(newValue)} label="Select Time" defaultValue={dayjs('2022-04-17T15:30')}/>
                    </LocalizationProvider>



                    <button type="submit" onClick={handleSubmit}>Save</button>
                </div>

            </div>
        </>
    )

}

export default Modal