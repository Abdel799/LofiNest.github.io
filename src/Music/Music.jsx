
import styles from './Music.module.css'

function Music({ 
  isPlaying, 
  currentSong, 
  currentTime, 
  duration, 
  songs, 
  handlePlay, 
  handlePause, 
  nextSong, 
  prevSong, 
  updateBar 
}) {

  return (
    <div className={styles.frame}>
      <img className={styles.img} src={songs[currentSong].img} alt="Lofi" />

      <h2 className={styles.songName}>{songs[currentSong].name}</h2>

      <div className={styles.buttons}>
        <button className={styles.leftBtn} onClick={prevSong}>
          <i className="fas fa-step-backward"></i>
        </button>
        
        {isPlaying ? (
          <button className={styles.pauseButton} onClick={handlePause}>
            <i className="fas fa-pause"></i>
          </button>
        ) : (
          <button className={styles.playButton} onClick={handlePlay}>
            <i className="fas fa-play"></i>
          </button>
        )}

        <button className={styles.rightBtn} onClick={nextSong}>
          <i className="fas fa-step-forward"></i>
        </button>
      </div>

      
    </div>
  )
}

export default Music