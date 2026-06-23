type PageProps = React.PropsWithChildren<{
  className?: string;
}>;

export const Page = ({ children, className }: PageProps) => (
  <div className={`h-full p-6 ${className ?? ""}`}>{children}</div>
);
