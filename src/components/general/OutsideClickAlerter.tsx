import React, { useRef, useEffect } from "react";
import { MdCallToAction } from "react-icons/md";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: React.RefObject<HTMLElement>, action: () => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                action()
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideAlerter(props: React.PropsWithChildren<{ action: () => void }>) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.action);

    return <div ref={wrapperRef}>{props.children}</div>;
}
