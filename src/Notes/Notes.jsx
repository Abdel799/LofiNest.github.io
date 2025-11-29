import styles from './Notes.module.css'
import { useState, useEffect, useRef } from "react"
import ModalDoc from './ModalDoc.jsx'
import EditModal from './EditModal.jsx'

function Notes () {

    const [docs, setDocs] = useState([])
    const [currentDoc, setCurrentDoc] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [openDoc, setOpenDoc] = useState(null)
    const editorRef = useRef(null);

    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
        insertUnorderedList: false
    });

     // Load from localStorage when component mounts
    useEffect(() => {
        const savedDocs = localStorage.getItem("documents");
        if (savedDocs) {
            setDocs(JSON.parse(savedDocs));
        }
    }, []);

    // Save to localStorage whenever docs change
    useEffect(() => {
        if (docs.length > 0) {
            localStorage.setItem("documents", JSON.stringify(docs));
        }
    }, [docs]);

    const addDoc = (newDoc) => {
        setDocs([...docs, newDoc])
    }

    const editDoc = () => {
        setIsOpen2(false)
        setIsOpen(true)
    }

    const deleteDoc = (docToDelete) => {
        
        setDocs(docs.filter(doc => doc.id !== docToDelete.id));
        setIsOpen2(false); // Close the modal after deleting
        setCurrentDoc(null); // Clear selected doc
        
    }

    const docUpdate = (updatedDoc) => {
        setDocs(docs.map(doc => 
            doc.id === updatedDoc.id ? updatedDoc : doc
        ));
    }

    useEffect(() => {
        if (editorRef.current && openDoc?.content) {
            editorRef.current.innerHTML = openDoc.content;
        }
    }, [openDoc?.id]);

    if (openDoc) {
        
        const updateDocContent = (e) => {
            const newContent = e.currentTarget.innerHTML;
            
            setDocs(prevDocs => 
                prevDocs.map(doc => 
                    doc.id === openDoc.id 
                        ? { ...doc, content: newContent }
                        : doc
                )
            );
            
            setOpenDoc(prev => ({ ...prev, content: newContent }));
        }; 
        
        const applyFormat = (command, value = null) => {
            document.execCommand(command, false, value);

            if (command === 'bold' || command === 'italic' || command === 'underline' || command === 'justifyLeft' || command === 'justifyCenter' || 
                command === 'justifyRight' || 
                command === 'insertUnorderedList') {
                setActiveFormats(prev => ({
                    ...prev,
                    [command]: !prev[command]
                }));
            }
            
            editorRef.current?.focus();
        };
    
        return (
            <div className={styles.documentView}>
                <button className={styles.backButton} onClick={() => setOpenDoc(null)}>←</button>
                <h1>{openDoc.Name}</h1>
                
                <div className={styles.toolbar}>
                    <button 
                        className={`${styles.toolButton} ${activeFormats.bold ? styles.toolButtonActive : ''}`}
                        onClick={() => applyFormat('bold')}
                        title="Bold"
                    >
                        <strong>B</strong>
                    </button>
                    <button 
                        className={`${styles.toolButton} ${activeFormats.italic ? styles.toolButtonActive : ''}`}
                        onClick={() => applyFormat('italic')}
                        title="Italic"
                    >
                        <em>I</em>
                    </button>
                    <button 
                        className={`${styles.toolButton} ${activeFormats.underline ? styles.toolButtonActive : ''}`}
                        onClick={() => applyFormat('underline')}
                        title="Underline"
                    >
                        <u>U</u>
                    </button>

                    <div className={styles.divider}></div>

                     {/* Alignment buttons */}
                    <button 
                        className={styles.toolButton}
                        onClick={() => applyFormat('justifyLeft')}
                        title="Align Left"
                    >
                        ⬅
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={() => applyFormat('justifyCenter')}
                        title="Align Center"
                    >
                        ↔
                    </button>
                    <button 
                        className={styles.toolButton}
                        onClick={() => applyFormat('justifyRight')}
                        title="Align Right"
                    >
                        ➡
                    </button>

                    <div className={styles.divider}></div>

                    {/* List buttons */}
                    <button 
                        className={styles.toolButton}
                        onClick={() => applyFormat('insertUnorderedList')}
                        title="Bullet List"
                    >
                        •
                    </button>

                     {/* Highlight color */}
                    <input 
                        type="color"
                        className={styles.colorPicker}
                        onChange={(e) => applyFormat('hiliteColor', e.target.value)}
                        title="Highlight Color"
                    />
    


                    <div className={styles.divider}></div>
                    <select 
                        className={styles.fontSelect}
                        onChange={(e) => applyFormat('fontName', e.target.value)}
                    >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                    </select>
                    <select 
                        className={styles.sizeSelect}
                        onChange={(e) => applyFormat('fontSize', e.target.value)}
                    >
                        <option value="1">8pt</option>
                        <option value="2">10pt</option>
                        <option value="3">11pt</option>
                        <option value="4">12pt</option>
                        <option value="5">14pt</option>
                        <option value="6">16pt</option>
                        <option value="7">18pt</option>
                    </select>
                </div>
                
                <div
                    ref={editorRef}
                    className={styles.documentTextarea}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onInput={updateDocContent}
                />
            </div>
        )
    }
    
    return (
        <>
            <div className={styles.notesParent}>

                <button className={styles.addNote} onClick={() => setIsOpen(true)}>+</button>
        
                {docs.map((docu, index) => (
                    <div key={index} className={styles.document} onClick={() => setOpenDoc(docu)}>

                        <div className={styles.documentPreview}></div>

                        <div className={styles.documentFooter}>
                            <div className={styles.documentTitle}>{docu.Name}</div>
                            <button className={styles.menuButton} onClick={(e) => {e.stopPropagation(); setIsOpen2(true); setCurrentDoc(docu);}}>⋮</button>            
                        </div>
                
                    </div>         
                ))}

            </div>

            <ModalDoc open={isOpen} onClose={() => setIsOpen(false)} add={addDoc} editDoc={currentDoc} updateDoc={docUpdate} reset={setCurrentDoc}></ModalDoc>
            <EditModal open={isOpen2} onClose={() => setIsOpen2(false)} edit={editDoc} myDoc={currentDoc} delete2={deleteDoc}></EditModal>
            
        </>
    )

}

export default Notes