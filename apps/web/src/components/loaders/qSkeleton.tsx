import React from 'react';

const SkeletonLoader: React.FC = () => {
    return (
        <div className="w-95 mx-auto flex flex-col flex-grow gap-5 py-6 relative">
            <div className="w-full h-[calc(100vh-5rem)] bg-gray-300 animate-pulse rounded-md"></div>
        </div>
    );
};

export default SkeletonLoader;
