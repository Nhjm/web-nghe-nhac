"use client";

import { createContext, useContext, useState } from "react";

interface ITrackContext {
    currentTrack: ICurrentTrack;
    setCurrentTrack: React.Dispatch<React.SetStateAction<ICurrentTrack>>;
}

const TrackContext = createContext<ITrackContext | null>(null);

export const TrackContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [currentTrack, setCurrentTrack] = useState<ICurrentTrack>({
        _id: "",
        title: "",
        description: "",
        category: "",
        imgUrl: "",
        trackUrl: "",
        countLike: 0,
        countPlay: 0,
        uploader: {
            _id: "",
            email: "",
            name: "",
            role: "",
            type: "",
        },
        isDeleted: false,
        __v: 0,
        createdAt: "",
        updatedAt: "",
        isPlaying: false,
    });

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
            {children}
        </TrackContext.Provider>
    );
};

export const useTrackContext = () => {
    return useContext(TrackContext)!;
};
