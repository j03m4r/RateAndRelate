import * as TT from '@radix-ui/react-tooltip';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
};

const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
}) => {
    return (
        <TT.Provider delayDuration={250} skipDelayDuration={400}>
            <TT.Root>
                <TT.Trigger asChild>
                    {children}
                </TT.Trigger>
                <TT.Portal>
                <TT.Content className="text-forestGreen" sideOffset={5}>
                    {content}
                    {/* <TT.Arrow className="" color='#97B34B' /> */}
                </TT.Content>
                </TT.Portal>
            </TT.Root>
        </TT.Provider>
    );
}

export default Tooltip;