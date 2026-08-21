import styles from './Dashboard.module.css'
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard () {

    const [open, setOpen] = useState(false);

    useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 900px)");

  const handleBreakpointChange = (event) => {
    if (!event.matches) {
      setOpen(false);
    }
  };

  mediaQuery.addEventListener("change", handleBreakpointChange);

  return () => {
    mediaQuery.removeEventListener("change", handleBreakpointChange);
  };
}, []);

    return (
        
        <div className={styles.dashboard}>

            <div className={styles.card}>

                {/*<h1 className={styles.logo}><span className={styles.lofi}>Lofi</span><span className={styles.nest}> Nest</span></h1> */}
                <NavLink to="/" onClick={() => setOpen(false)} className={styles.logo}><span className={styles.lofi}>Lofi</span><span className={styles.nest}> Nest</span></NavLink>
        
            </div>

            <div className={styles.line}></div>

            <button
                className={styles.menuBtn}
                onClick={() => setOpen(!open)}
                aria-label="Toggle navigation"
                aria-expanded={open}
            >
                ☰
            </button>

            <div className={`${styles.card2} ${open ? styles.open : ""}`}>
                {/*<h2>Chat Bot</h2>
                <h2>Calendar</h2>
                <h2>Notes</h2>
                <h2>StudyJam</h2>*/}

                <NavLink to="/chat" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Chat Bot</NavLink>
                <NavLink to="/calendar" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Calendar</NavLink>
                <NavLink to="/notes" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Notes</NavLink>
                <NavLink to="/studyjam" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>StudyJam</NavLink>
            </div>

        </div>
    )

}

export default Dashboard