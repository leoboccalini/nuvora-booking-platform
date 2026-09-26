import React from 'react';
type Step = 'Service Class' | 'Pickup Info' | 'Log In' | 'Payment' | 'Checkout' | 'Confirmation';
interface StepProgressProps {
    activeStep?: Step;
}
const MobileStepProgress: React.FC<{
    steps: Step[];
    activeStep: Step;
}> = ({ steps, activeStep }) => {
    const activeIndex = steps.findIndex(step => step === activeStep);
    return (<div className="flex flex-col items-center w-full space-y-3">
            
            <div className="flex items-center justify-between w-full">
                <span className="text-lg font-semibold text-white">
                    {activeStep}
                </span>
                <span className="text-sm text-gray-400 font-medium">
                    Step {activeIndex + 1} of {steps.length}
                </span>
            </div>
            
            <div className="flex items-center w-full justify-center">
                {steps.map((step, idx) => (<React.Fragment key={step}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300
                            ${idx <= activeIndex ? 'border-[#FFD900] bg-black' : 'border-gray-700 bg-black'}
                        `}>
                            
                            <div className={`w-2 h-2 rounded-full ${idx <= activeIndex ? 'bg-[#FFD900]' : 'bg-gray-700'}`}></div>
                        </div>
                        
                        {idx < steps.length - 1 && (<div className={`flex-1 h-0.5 mx-1 transition-all duration-300 ${idx < activeIndex ? 'bg-[#FFD900]' : 'bg-gray-800'}`} style={{ minWidth: 24 }}></div>)}
                    </React.Fragment>))}
            </div>
        </div>);
};
const DesktopStepProgress: React.FC<{
    steps: Step[];
    activeStep: Step;
}> = ({ steps, activeStep }) => {
    const activeIndex = steps.findIndex(step => step === activeStep);
    return (<div className="flex items-center max-w-sm sm:max-w-md lg:max-w-2xl overflow-visible">
            {steps.map((step, index) => (<React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-2 font-medium text-center leading-tight whitespace-nowrap">
                            
                            <span className="hidden sm:inline">{step}</span>
                            <span className="sm:hidden">
                                {step === 'Service Class' ? 'Service' :
                step === 'Pickup Info' ? 'Pickup' :
                    step === 'Log In' ? 'Login' :
                        step === 'Payment' ? 'Pay' :
                            step === 'Checkout' ? 'Check' :
                                step === 'Confirmation' ? 'Done' : step}
                            </span>
                        </span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${index <= activeIndex
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-400'}`}>
                            {index + 1}
                        </div>
                    </div>
                    {index < steps.length - 1 && (<div className="w-6 sm:w-8 lg:w-12 h-px mx-1 sm:mx-1.5 bg-gray-200 relative">
                            <div className={`h-px transition-all duration-500 ${index < activeIndex
                    ? 'bg-black w-full'
                    : 'bg-gray-200 w-0'}`}></div>
                        </div>)}
                </React.Fragment>))}
        </div>);
};
export const StepProgress: React.FC<StepProgressProps> = ({ activeStep = 'Service Class' }) => {
    const steps: Step[] = ['Service Class', 'Pickup Info', 'Log In', 'Payment', 'Checkout', 'Confirmation'];
    return (<div className="py-4 lg:hidden relative z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center">
                    
                    <MobileStepProgress steps={steps} activeStep={activeStep}/>
                </div>
            </div>
        </div>);
};
