import propTypes from "prop-types";
import {useEffect} from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

const modalRoot = document.querySelector("#modal-root");

export default function Modal(props) {
    useEffect(() => {
        const closeOnKeydown = (event) => {       
            if (event.code === "Escape") {
                props.onClose();
            }
        }
        window.addEventListener('keydown', closeOnKeydown);
        
        return function listenerCleanup() {
            window.removeEventListener('keydown', closeOnKeydown);
        }
    }, [props]);

    const closeOnBackdrop = (event) => {
        if (event.target === event.currentTarget) {
            props.onClose();
        }     
    }

    return createPortal(
        <div className={ styles.Overlay } onClick={closeOnBackdrop}>
            <div className={styles.Modal}>
                {props.children}
            </div>
        </div>,
        modalRoot
    ); 
}

Modal.propTypes = {
    children: propTypes.node,
    onClose: propTypes.func.isRequired,
}

// export default Modal;