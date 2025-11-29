import styles from './Calendar.module.css'
import { useState } from "react"
import { useRef, useEffect } from "react"
import Modal from './Modal.jsx'
import EventModal from './Event-Modal.jsx'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function Calendar () {
    
    const [myDate, setMyDate] = useState(new Date());
    const [myDay, setMyDay] = useState(myDate.getDate())
    const [isOpen, setIsOpen] = useState(false)
    const [events, setEvents] = useState([])
    const eventContainerRefs = useRef({})
    const [isOpen2, setIsOpen2] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log("Loading from localStorage...");
        const savedEvents = localStorage.getItem('calendarEvents');
        console.log("Saved events:", savedEvents);
        if (savedEvents) {
            const parsed = JSON.parse(savedEvents);
            console.log("Parsed events:", parsed);
            setEvents(parsed);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            console.log("Saving to localStorage:", events);
            localStorage.setItem('calendarEvents', JSON.stringify(events));
        }
    }, [events, isLoaded]);


    const increase = () => {
        const newDate = new Date(myDate);
        newDate.setMonth(myDate.getMonth() + 1);
        setMyDate(newDate);
    };

    const decrease = () => {
        const newDate = new Date(myDate);
        newDate.setMonth(myDate.getMonth() - 1);
        setMyDate(newDate);
    };

    const updateDay = (day) => {
        setMyDay(day)
        myDate.setDate(day)
    }

    const addEvent = (event) => {
        const colors = [
            '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#DDA0DD', '#FF7F50', '#87CEEB', '#98D8C8', 
            '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A'
        ];
        
        const eventWithColor = {
            ...event,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
        
        setEvents([...events, eventWithColor]);

        setTimeout(() => {
            const dateKey = event.Date;
            const container = eventContainerRefs.current[dateKey];
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 100);
    }

    const getEventsForDate = (day) => {
        if (!day) return [];
        
        const year = myDate.getFullYear();
        const month = myDate.getMonth();
        const dateString = new Date(year, month, day).toISOString().split("T")[0];
        
        const dayEvents = events.filter(event => event.Date === dateString);
    
    // Sort events by time (earliest to latest)
        return dayEvents.sort((a, b) => {
            const timeA = dayjs(a.Time, "h:mm A");
            const timeB = dayjs(b.Time, "h:mm A");
            return timeA - timeB;
        });
    }

    const handleEdit = () => {
        setIsOpen(true)
        setIsOpen2(false)
    }

    const eventUpdate = (updatedEvent) => {
        setEvents(events.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
        ));
    }

    const handleDelete = (eventToDelete) => {
        setEvents(events.filter(event => event.id !== eventToDelete.id));
        setIsOpen2(false); // Close the modal after deleting
        setSelectedEvent(null); // Clear selected event
    }
    
    const options = { month: "long", day: "numeric", year: "numeric" };
    let today = myDate.toLocaleDateString("en-US", options);

    const suffix =
        myDay % 10 === 1 && myDay !== 11
            ? "st"
            : myDay % 10 === 2 && myDay !== 12
            ? "nd"
            : myDay % 10 === 3 && myDay !== 13
            ? "rd"
            : "th";

    today = today.replace(myDay.toString(), myDay + suffix);

    //const days = Array.from({ length: 35 }, (_, i) => i + 1);
    //const days = Array.from({ length: 35 });

    const year = myDate.getFullYear()
    const month = myDate.getMonth()
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = myDay

    const totalCells = firstDayOfWeek + daysInMonth;
    const gridSize = Math.ceil(totalCells / 7) * 7;
    const days = Array.from({ length: gridSize });

    for (let i = 0; i < daysInMonth; i++) {
        days[firstDayOfWeek + i] = i + 1;
    }
    
    return (
        
        <>
        
            <div className={styles.frame}>

                <h1 className={styles.date}>{today}</h1>

                <div className={styles.buttons}>
                    <button className={styles.left} onClick={decrease}><i className="fas fa-arrow-left"></i></button>
                    <button className={styles.right} onClick={increase}><i className="fas fa-arrow-right"></i></button>
                </div>

                <div className={styles.days}>

                    <h2>Sun</h2>
                    <h2>Mon</h2>
                    <h2>Tue</h2>
                    <h2>Wed</h2>
                    <h2>Thu</h2>
                    <h2>Fri</h2>
                    <h2>Sat</h2>

                </div>

                <div className={styles.calendar}>

                {days.map((day, index) => {
                        const dayEvents = getEventsForDate(day);
                        
                        return (
                            <div key={index} className={day === currentDay ? styles.currentDay : styles.calendar__cell} onClick={day ? () => updateDay(day) : undefined} onDoubleClick={day ? () => setIsOpen(true) : undefined}>

                                {day ? (
                                    <>
                                        <span className="day-number" style={{backgroundColor: "transparent"}}>{day}</span>
                                        
                                        {/* Render events for this day */}
                                        <div className={styles.eventsContainer} ref={el => {
                                            const dateString = new Date(year, month, day).toISOString().split("T")[0];
                                            eventContainerRefs.current[dateString] = el;
                                        }}>
                                            {dayEvents.map(event => (
                                                <div key={event.id} className={styles.event} title={`${event.Name} at ${event.Time}`} style={{ backgroundColor: event.color, borderColor: event.color }} onClick={() => {setIsOpen2(true); setSelectedEvent(event);}}>
                                                    <span className={styles.eventTime}>{event.Time} </span>
                                                    <span className={styles.eventName}>{event.Name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <span className={styles.emptyCell}>×</span>
                                )}  

                            </div>
                        )
                    })}

                </div>

            </div>

            <Modal open={isOpen} onClose={() => setIsOpen(false)} add={addEvent} selectedDate={new Date(year, month, myDay)} editEvent={selectedEvent} updateEvent={eventUpdate} reset={setSelectedEvent}></Modal>
            <EventModal open={isOpen2} onClose = {() => setIsOpen2(false)} edit={handleEdit} editEvent={selectedEvent} delete2={handleDelete}></EventModal>
        
        </>

    )

}

export default Calendar