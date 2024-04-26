import { useContext, createContext, useMemo, useCallback } from "react";
import { Subject } from "rxjs";

const EventBusContext = createContext({});

export function ProvideEventBus({ children }) {
    const eventBus = useProvideEventBus();
    return <EventBusContext.Provider value={eventBus}>{children}</EventBusContext.Provider>;
}

export const useEventBus = () => {
    return useContext(EventBusContext);
};

let eventSubscriptionMapping = {};

function useProvideEventBus() {

    //dispatch details for a topic
    const dispatch = useCallback((topic, data) => {
        const subjects = eventSubscriptionMapping[topic] || [];
        for (let s of subjects) {
            s.next(data);
        }
    }, []);

    //method to subscribe for a topic
    const on = useCallback((topic, callback) => {
        const subject = new Subject();

        subject.subscribe({
            next: (v) => callback(v),
        });
        const existingSubjectsByTopic = eventSubscriptionMapping[topic] || [];
        eventSubscriptionMapping = {
            ...eventSubscriptionMapping,
            [topic]: [...existingSubjectsByTopic, subject],
        };
        return subject;
    }, []);

    //method to unsubsribe for a topc
    const unsubscribe = useCallback((topic, subject) => {
        const existingSubjectsByTopic = eventSubscriptionMapping[topic] || [];
        eventSubscriptionMapping = {
            ...eventSubscriptionMapping,
            [topic]: [...existingSubjectsByTopic.filter((s) => s !== subject)],
        };
    }, []);

    return useMemo(
        () => ({
            dispatch,
            on,
            unsubscribe,
        }),
        [dispatch, on, unsubscribe],
    );
}

