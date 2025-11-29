import styles from './Dashboard.module.css'
import { NavLink } from "react-router-dom";

function Dashboard () {

    return (
        <div className={styles.dashboard}>

            <div className={styles.card}>

                {/*<h1 className={styles.logo}><span className={styles.lofi}>Lofi</span><span className={styles.nest}> Nest</span></h1> */}
                <NavLink to="/" className={styles.logo}><span className={styles.lofi}>Lofi</span><span className={styles.nest}> Nest</span></NavLink>
        
            </div>

            <div className={styles.line}></div>

            <div className={styles.card2}>
                {/*<h2>Chat Bot</h2>
                <h2>Calendar</h2>
                <h2>Notes</h2>
                <h2>StudyJam</h2>*/}

                <NavLink to="/chat" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Chat Bot</NavLink>
                <NavLink to="/calendar" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Calendar</NavLink>
                <NavLink to="/notes" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Notes</NavLink>
                <NavLink to="/studyjam" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>StudyJam</NavLink>
            </div>

        </div>
    )

}

export default Dashboard