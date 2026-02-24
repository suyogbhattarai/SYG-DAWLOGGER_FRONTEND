'use client';

import React from 'react';
import MultitrackMixer from '@/components/dashboard/MultitrackMixer';

const MixerPage = () => {
    return (
        <div className="p-4 h-[calc(100vh-5rem)]">
            <MultitrackMixer />
        </div>
    );
};

export default MixerPage;
