import React from 'react';
interface SimpleSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
    message?: string;
}
export const SimpleSpinner: React.FC<SimpleSpinnerProps> = ({ size = 'large', fullScreen = false, message }) => {
    const sizeClasses = {
        small: 'h-8 w-8 border-2',
        medium: 'h-12 w-12 border-3',
        large: 'h-16 w-16 border-4'
    };
    const content = (<div className="text-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} mx-auto`} style={{
            borderColor: 'transparent',
            borderTopColor: '#FFD900',
            borderRightColor: '#FFD900',
            borderStyle: 'solid'
        }}/>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>);
    if (fullScreen) {
        return (<div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center backdrop-blur-md">
        {content}
      </div>);
    }
    return (<div className={fullScreen ? "text-white" : "text-gray-600"}>
      {content}
    </div>);
};
