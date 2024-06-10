interface ContainerProps {
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className="w-[95%] lg:w-92% m-auto py-2 h-full">{children}</div>;
};

export default Container;
