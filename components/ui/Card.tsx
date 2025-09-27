
// Common props for card components
interface BaseCardProps {
    children: React.ReactNode;
    className?: string;
}

// Props for components rendering a <div>
// FIX: Use Omit to prevent a type conflict on the 'children' property.
// React.HTMLAttributes defines 'children' as optional, while BaseCardProps requires it,
// which causes a conflict when an interface extends both. Omit removes 'children'
// from HTMLAttributes, so the definition from BaseCardProps is used without conflict.
interface DivCardProps extends BaseCardProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {}

// Props for components rendering an <h3>
// FIX: Use Omit to prevent a type conflict on the 'children' property.
interface TitleCardProps extends BaseCardProps, Omit<React.HTMLAttributes<HTMLHeadingElement>, 'children'> {}

// Props for components rendering a <p>
// FIX: Use Omit to prevent a type conflict on the 'children' property.
interface DescriptionCardProps extends BaseCardProps, Omit<React.HTMLAttributes<HTMLParagraphElement>, 'children'> {}


// Spreading `...props` allows passing additional attributes like `onClick`.
export const Card: React.FC<DivCardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-card border border-border rounded-lg shadow-md ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<DivCardProps> = ({ children, className = '', ...props }) => {
    return <div className={`p-4 md:p-6 border-b border-border ${className}`} {...props}>{children}</div>;
};

export const CardContent: React.FC<DivCardProps> = ({ children, className = '', ...props }) => {
    return <div className={`p-4 md:p-6 ${className}`} {...props}>{children}</div>;
};

export const CardTitle: React.FC<TitleCardProps> = ({ children, className = '', ...props }) => {
    return <h3 className={`text-lg font-semibold text-foreground ${className}`} {...props}>{children}</h3>;
};

export const CardDescription: React.FC<DescriptionCardProps> = ({ children, className = '', ...props }) => {
    return <p className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</p>;
};
